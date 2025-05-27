const express = require("express");
const TimeSlot = require("../models/Timeslots");
const { updateTimeSlots, createTimeSlotsForRange, adjustDateToUTC } = require("../controllers/timeslotController");

const router = express.Router();

// Get all time slots
// router.get("/", async (req, res) => {
//   try {
//     const timeSlots = await TimeSlot.find();
//     res.json(timeSlots);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching time slots", error });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const { date } = req.query;

//     if (date) {
//       // Normalize the date to midnight UTC
//       const normalizedDate = new Date(date);
//       normalizedDate.setUTCHours(0, 0, 0, 0);

//       // Find time slots for the specified date
//       const timeSlots = await TimeSlot.find({ date: normalizedDate });

//       if (timeSlots.length === 0) {
//         return res
//           .status(404)
//           .json({ message: "No time slots found for the specified date" });
//       }

//       return res.json(timeSlots);
//     }

//     // If no date is provided, return all time slots
//     const allTimeSlots = await TimeSlot.find();
//     res.json(allTimeSlots);
//   } catch (error) {
//     console.error("Error fetching time slots:", error);
//     res.status(500).json({ message: "Error fetching time slots", error });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    if (date) {
      // Normalize the date to midnight UTC
      // Use the reusable function to adjust dates
      const adjustedDate = adjustDateToUTC(date);
      

      console.log("Adjusted date for timezone:", adjustedDate.toISOString());

      // Find time slots for the adjusted date
      const timeSlots = await TimeSlot.find({ date: adjustedDate });

      if (timeSlots.length === 0) {
        return res
          .status(404)
          .json({ message: "No time slots found for the specified date" });
      }

      console.log("Time slots found:", timeSlots);

      return res.json(timeSlots);
    }

    // If no date is provided, return all time slots
    const allTimeSlots = await TimeSlot.find();
    res.json(allTimeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ message: "Error fetching time slots", error });
  }
});

router.post("/update", async (req, res) => {
  try {
    await updateTimeSlots();
    res.json({ message: "Time slots updated successfully" });
  } catch (error) {
    console.error("Error in /update endpoint:", error);
     res
       .status(500)
       .json({
         message: "Error updating time slots",
         error: error.message || error,
       });
  }
});

// router.post("/create-for-range", async (req, res) => {
//   try {
  
//     const { startDate, endDate } = req.body;

//     if (!startDate || !endDate) {
//       return res
//         .status(400)
//         .json({ message: "Start and end dates are required" });
//     }

//     await createTimeSlotsForRange(new Date(startDate), new Date(endDate));
//     res.json({ message: "Time slots created for the specified range" });
//   } catch (error) {
//     console.error("Error in /create-for-range endpoint:", error);
//     res.status(500).json({ message: "Error creating time slots", error });
//   }
// });

router.post("/create-for-range", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    // Use the reusable function to adjust dates
    const adjustedStartDate = adjustDateToUTC(startDate);
    const adjustedEndDate = adjustDateToUTC(endDate);

    console.log(
      "Adjusted start date for timezone:",
      adjustedStartDate.toISOString()
    );
    console.log(
      "Adjusted end date for timezone:",
      adjustedEndDate.toISOString()
    );

    // Pass the adjusted dates to the createTimeSlotsForRange function
    await createTimeSlotsForRange(adjustedStartDate, adjustedEndDate);

    res.json({ message: "Time slots created for the specified range" });
  } catch (error) {
    console.error("Error in /create-for-range endpoint:", error);
    res.status(500).json({ message: "Error creating time slots", error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { date, startDate, endDate } = req.body;

    // If a single date is provided
    if (date) {
      const adjustedDate = adjustDateToUTC(date);

      console.log("Adjusted date for deletion:", adjustedDate.toISOString());

      const result = await TimeSlot.deleteMany({ date: adjustedDate });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No time slots found for the specified date" });
      }

      return res.json({ message: `Deleted ${result.deletedCount} time slot(s) for the specified date` });
    }

    // If a range of dates is provided
    if (startDate && endDate) {
      const adjustedStartDate = adjustDateToUTC(startDate);
      const adjustedEndDate = adjustDateToUTC(endDate);

      console.log("Adjusted start date for deletion:", adjustedStartDate.toISOString());
      console.log("Adjusted end date for deletion:", adjustedEndDate.toISOString());

      const result = await TimeSlot.deleteMany({
        date: { $gte: adjustedStartDate, $lte: adjustedEndDate },
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No time slots found for the specified range" });
      }

      return res.json({ message: `Deleted ${result.deletedCount} time slot(s) for the specified range` });
    }

    // If neither date nor range is provided
    return res.status(400).json({ message: "Please provide a date or a date range (startDate and endDate)" });
  } catch (error) {
    console.error("Error deleting time slots:", error);
    res.status(500).json({ message: "Error deleting time slots", error });
  }
});


module.exports = router;
