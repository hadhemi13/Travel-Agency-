import mongoose from 'mongoose';

const ComparisonSchema = new mongoose.Schema({
  programIds: [{ 
    type: String, 
    required: true 
  }],
  
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  destination: { 
    type: String, 
    required: true 
  },
  
  // ✅ On garde programMetrics comme tu veux
  programMetrics: [{
    programId: String,
    
    metrics: {
      totalCost: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      avgCostPerDay: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      hotel: {
        value: String,
        stars: Number,
        isWinner: Boolean
      },
      numberOfDays: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      totalActivities: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      totalDistance: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      activityDiversity: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      avgIntensity: {
        value: String,
        numericValue: Number,
        isWinner: Boolean
      },
      valueForMoney: {
        value: String,
        score: Number,
        isWinner: Boolean
      }
    },
    
    categories: {
      culture: Boolean,
      nature: Boolean,
      gastronomy: Boolean,
      adventure: Boolean,
      relaxation: Boolean,
      shopping: Boolean,
      nightlife: Boolean,
      sports: Boolean
    }
  }],
  
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index: true 
  },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    index: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.models.Comparison || mongoose.model('Comparison', ComparisonSchema);