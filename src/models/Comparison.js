import mongoose from 'mongoose';

// 🔴 SUPPRIMER le modèle existant du cache
if (mongoose.models.Comparison) {
  delete mongoose.models.Comparison;
}

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

  // 🔴 IMPORTANT : Utiliser "programs" et non "programMetrics"
  programs: {
    type: [{
      id: String,
      name: String,
      image: String,
      totalCost: Number,
      numberOfDays: Number,
      rawData: { type: mongoose.Schema.Types.Mixed, default: [] },

      metrics: {
        type: {
          totalCost: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          avgCostPerDay: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          hotel: {
            value: String,
            stars: Number,
            isWinner: { type: Boolean, default: false }
          },
          numberOfDays: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          totalActivities: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          totalDistance: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          activityDiversity: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          avgIntensity: {
            value: String,
            numericValue: Number,
            isWinner: { type: Boolean, default: false }
          },
          valueForMoney: {
            value: String,
            score: Number,
            isWinner: { type: Boolean, default: false }
          }
        },
        required: false
      },

      categories: {
        type: {
          culture: { type: Boolean, default: false },
          nature: { type: Boolean, default: false },
          gastronomy: { type: Boolean, default: false },
          adventure: { type: Boolean, default: false },
          relaxation: { type: Boolean, default: false },
          shopping: { type: Boolean, default: false },
          nightlife: { type: Boolean, default: false },
          sports: { type: Boolean, default: false }
        },
        required: false
      }
    }],
    required: true,
    default: []
  },

  optimizedProgram: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  recommendation: {
    type: {
      recommendations: String,
      conclusion: String,
      scores: {
        program1: Number,
        program2: Number
      },
      bestProgram: Number
    },
    required: false
  },

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
  timestamps: true,
  strict: false  // 🔴 false pour éviter les problèmes de validation
});

// Index TTL
ComparisonSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hook pour debug
ComparisonSchema.pre('save', function(next) {
  console.log('💾 PRE-SAVE HOOK - Comparison');
  console.log('   📊 Programs count:', this.programs?.length || 0);
  console.log('   🏆 Has recommendation:', !!this.recommendation);
  
  if (this.programs && this.programs.length > 0) {
    console.log('   ✅ Premier programme:', {
      id: this.programs[0].id,
      name: this.programs[0].name,
      hasMetrics: !!this.programs[0].metrics
    });
  } else {
    console.error('   ❌ ERREUR: Tableau programs vide ou undefined !');
  }
  
  next();
});

ComparisonSchema.post('save', function(doc) {
  console.log('✅ POST-SAVE - Document sauvegardé');
  console.log('   📝 ID:', doc._id);
  console.log('   📊 Programs sauvegardés:', doc.programs?.length || 0);
});

// 🔴 FORCER la création d'un nouveau modèle
const Comparison = mongoose.model('Comparison', ComparisonSchema);

export default Comparison;