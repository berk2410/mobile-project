import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitudeDelta: {
      type: Number,
      required: true,
      default: 2,
    },
    longitudeDelta: {
      type: Number,
      required: true,
      default: 2,
    },
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'seminar', 'meetup', 'other'],
    default: 'other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;