import express from 'express';
import Event from '../Models/event.js'; // Event modelini doğru yolu ile ekleyin

const router = express.Router();

// Create Event
router.post('/create', async (req, res) => {
  try {
    const { name, description, startDate, endDate, location, category } = req.body;

    const newEvent = new Event({
      name,
      description,
      startDate,
      endDate,
      location,
      category,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      message: 'Etkinlik başarıyla oluşturuldu!',
      event: savedEvent,
    });
  } catch (error) {
    console.error('Etkinlik oluşturma hatası:', error);

    res.status(500).json({
      message: 'Etkinlik oluşturulurken bir hata oluştu.',
      error: error.message,
    });
  }
});

//get events
router.get('/get-all-events', async (req, res) => {
    try {
      const events = await Event.find(); // Tüm etkinlikleri almak için find() kullanılır.
      
      res.status(200).json({
        message: 'Etkinlikler başarıyla getirildi!',
        events: events,
      });
    } catch (error) {
      console.error('Etkinlikleri getirirken bir hata oluştu:', error);
      res.status(500).json({
        message: 'Etkinlikler getirilirken bir hata oluştu.',
        error: error.message,
      });
    }
  });

  //delete
  router.delete('/delete/:id', async (req, res) => {
    try {
      const eventId = req.params.id;
      
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      
      if (!deletedEvent) {
        return res.status(404).json({
          message: 'Etkinlik bulunamadı.',
        });
      }
      
      res.status(200).json({
        message: 'Etkinlik başarıyla silindi.',
        event: deletedEvent,
      });
    } catch (error) {
      console.error('Etkinlik silme hatası:', error);
      res.status(500).json({
        message: 'Etkinlik silinirken bir hata oluştu.',
        error: error.message,
      });
    }
  });

export default router;
