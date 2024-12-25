import app from './app.js';
import cors from 'cors';
import { PORT } from './utils/config.js';
import event from './Controller/event.js'; // Default export doğru bir şekilde alınır

app.use(cors());
app.use('/event', event);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
