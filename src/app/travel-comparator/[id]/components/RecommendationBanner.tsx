import { FaTrophy, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

interface RecommendationProps {
  recommendation: {
    recommendations: string;
    conclusion: string;
    scores: {
      program1: number;
      program2: number;
    };
    bestProgram: number;
  };
}

export default function RecommendationBanner({ recommendation }: RecommendationProps) {
  const { recommendations, conclusion, scores, bestProgram } = recommendation;

  // Couleurs selon le meilleur programme
  const getBannerColor = () => {
    if (bestProgram === 1) return 'from-purple-600 to-purple-800';
    if (bestProgram === 2) return 'from-blue-600 to-blue-800';
    return 'from-gray-600 to-gray-800';
  };

  return (
    <div className="w-full py-4 sm:py-6 md:py-8 px-3 sm:px-4 bg-gray-50 dark:bg-[#222529]">
      <div className="container mx-auto max-w-6xl">
        {/* Banner principal */}
        <div className={`bg-gradient-to-r ${getBannerColor()} rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6`}>
          
          {/* Header avec icône et titre */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/20 p-3 sm:p-4 rounded-full">
              <FaTrophy className="text-2xl sm:text-3xl md:text-4xl text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                Recommandation personnalisée
              </h2>
              <p className="text-white/80 text-xs sm:text-sm">
                Basée sur vos critères de voyage
              </p>
            </div>
          </div>

          {/* Scores visuels - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Programme 1 */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 ${
              bestProgram === 1 ? 'border-yellow-400' : 'border-white/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-base sm:text-lg">
                  Programme 1
                </span>
                {bestProgram === 1 && (
                  <FaCheckCircle className="text-yellow-400 text-xl sm:text-2xl flex-shrink-0" />
                )}
              </div>
              
              {/* Barre de progression */}
              <div className="mt-2 bg-white/20 rounded-full h-2.5 sm:h-3 overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full transition-all duration-500"
                  style={{ 
                    width: `${(scores.program1 / (scores.program1 + scores.program2)) * 100}%` 
                  }}
                />
              </div>
              
              <p className="text-white/80 text-xs sm:text-sm mt-2">
                Score : <span className="font-bold">{scores.program1}</span> points
              </p>
            </div>

            {/* Programme 2 */}
            <div className={`bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 ${
              bestProgram === 2 ? 'border-yellow-400' : 'border-white/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-base sm:text-lg">
                  Programme 2
                </span>
                {bestProgram === 2 && (
                  <FaCheckCircle className="text-yellow-400 text-xl sm:text-2xl flex-shrink-0" />
                )}
              </div>
              
              {/* Barre de progression */}
              <div className="mt-2 bg-white/20 rounded-full h-2.5 sm:h-3 overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full transition-all duration-500"
                  style={{ 
                    width: `${(scores.program2 / (scores.program1 + scores.program2)) * 100}%` 
                  }}
                />
              </div>
              
              <p className="text-white/80 text-xs sm:text-sm mt-2">
                Score : <span className="font-bold">{scores.program2}</span> points
              </p>
            </div>
          </div>

          {/* Conclusion - Box avec scroll si nécessaire sur mobile */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line break-words">
                {conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Détails des recommandations */}
        <div className="bg-white dark:bg-[#19222b] rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          
          {/* Header avec icône */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FaLightbulb className="text-xl sm:text-2xl text-yellow-500 flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Analyse détaillée
            </h3>
          </div>
          
          {/* Liste des recommandations */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 space-y-3 sm:space-y-4">
              {recommendations.split('\n\n').map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-3">
                  {/* Bullet point */}
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm sm:text-base">
                    •
                  </span>
                  
                  {/* Texte avec gestion du bold */}
                  <p 
                    className="text-sm sm:text-base leading-relaxed break-words flex-1"
                    dangerouslySetInnerHTML={{ 
                      __html: rec.replace(
                        /\*\*(.*?)\*\*/g, 
                        '<strong class="text-purple-700 dark:text-purple-400 font-semibold">$1</strong>'
                      )
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Légende - Footer */}
        <div className="mt-4 sm:mt-6 text-center px-2">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            💡 Cette recommandation est basée sur votre budget, type de voyage et préférences. 
            <br className="hidden sm:inline" />
            <span className="inline sm:inline"> Le choix final vous appartient !</span>
          </p>
        </div>
      </div>
    </div>
  );
}