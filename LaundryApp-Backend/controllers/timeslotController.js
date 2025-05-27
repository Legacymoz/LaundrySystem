const TimeSlot = require("../models/Timeslots");
const cron = require("node-cron");

async function incrementOrderCount(date, time) {
  try {

    console.log("Incrementing order count for date:", date, "and time:", time);
    // Find the timeslot for the given date and time
    const adjustedDate = adjustDateToUTC(date); // Adjust date to UTC
    console.log("Adjusted Date:", adjustedDate); // Log the adjusted date
    
    const timeSlot = await TimeSlot.findOne({ date: adjustedDate, "slots.time": time });
    console.log("Time Slot:", timeSlot); // Log the found time slot

    if (!timeSlot) {
      return { success: false, message: "Time slot not found" };
    }

    // Find the specific slot
    const slot = timeSlot.slots.find((s) => s.time === time);

    if (!slot) {
      return { success: false, message: "Invalid slot time" };
    }

    // Increment order count (No need to check if it's full)
    slot.currentOrders += 1;
    timeSlot.markModified("slots"); // Mark the slots array as modified
    await timeSlot.save(); // Save changes

    return { message: "Count updated successfully" };
  } catch (error) {
    console.error("Error incrementing order count:", error);
    return { success: false, message: "Error updating order count" };
  }
}

async function createTimeSlotsForDate(date) {
  const times = ["08:00 AM", "01:00 PM", "06:00 PM"];

  const newTimeSlot = new TimeSlot({
    date,
    slots: times.map((time) => ({
      time,
      currentOrders: 0,
      maxOrders: 50,
    })),
  });

  await newTimeSlot.save();
  console.log(`✅ Created time slots for ${date.toDateString()}`);
}

// Function to handle daily time slot updates
async function updateTimeSlots() {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to midnight UTC

    const nextWeekDate = new Date(today);
    nextWeekDate.setUTCDate(today.getUTCDate() + 7); // Add 7 days in UTC
    nextWeekDate.setUTCHours(0, 0, 0, 0); // Ensure it's midnight UTC

    console.log("new date (UTC):", nextWeekDate.toISOString());

    // Adjust for your local timezone offset
    const localOffset = nextWeekDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const adjustedDate = new Date(nextWeekDate.getTime() - localOffset);

    console.log(
      "new date (adjusted for local timezone):",
      adjustedDate.toISOString()
    );

    // Delete expired time slots (past dates)
    await TimeSlot.deleteMany({ date: { $lt: today } });
    console.log(`Deleted old time slots before ${today.toISOString()}`);

    // Create new time slots for the next week's date
    const existingSlot = await TimeSlot.findOne({ date: adjustedDate });

    if (!existingSlot) {
      await createTimeSlotsForDate(adjustedDate);
    } else {
      console.log(
        `Time slots for ${adjustedDate.toDateString()} already exist.`
      );
    }
  } catch (error) {
    console.error("Error updating time slots:", error);
    throw error; // Rethrow the error to be handled by the cron job
  }
}

// Schedule the cron job to run **every midnight**
cron.schedule("0 0 * * *", updateTimeSlots, {
  scheduled: true,
  timezone: "Africa/Nairobi", // Change based on your server location
});

console.log("Time Slot Cron Job Scheduled...");

async function createTimeSlotsForRange(startDate, endDate) {
  try {
    // const currentDate = new Date(startDate);
    // currentDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC

    // const normalizedEndDate = new Date(endDate);
    // normalizedEndDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC

    while (startDate <= endDate) {
      const existingSlot = await TimeSlot.findOne({ date: startDate });

      if (!existingSlot) {
        await createTimeSlotsForDate(new Date(startDate));
      } else {
        console.log(
          `Time slots for ${startDate.toDateString()} already exist.`
        );
      }

      // Move to the next day
      startDate.setUTCDate(startDate.getUTCDate() + 1);
    }

    console.log("✅ Time slots created for the specified range.");
  } catch (error) {
    console.error("Error creating time slots for range:", error);
    throw error;
  }
}


/**
 * Adjusts a date to midnight UTC and applies the local timezone offset.
 * @param {string | Date} date - The date to adjust (can be a string or Date object).
 * @returns {Date} - The adjusted date.
 */
function adjustDateToUTC(date) {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC
  const localOffset = normalizedDate.getTimezoneOffset() * 60000; // Offset in milliseconds
  return new Date(normalizedDate.getTime() - localOffset); // Adjust for local timezone
}

module.exports = { adjustDateToUTC };


module.exports = { incrementOrderCount, updateTimeSlots, createTimeSlotsForRange, adjustDateToUTC };