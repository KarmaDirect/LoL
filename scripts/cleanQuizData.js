const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON original
const inputPath = path.join(__dirname, '../quizz/lol_quiz_vague_1.json');
const outputPath = path.join(__dirname, '../quizz/lol_quiz_vague_1_clean.json');

console.log('🧹 Début du nettoyage du fichier JSON...');

try {
  // Lire le fichier JSON original
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const questions = JSON.parse(rawData);
  
  console.log(`📊 Questions originales: ${questions.length}`);
  
  // Créer un Map pour stocker les questions uniques
  const uniqueQuestions = new Map();
  const duplicates = [];
  
  questions.forEach((question, index) => {
    // Créer une clé unique basée sur la question et la réponse
    const key = `${question.question}_${question.answer}`;
    
    if (uniqueQuestions.has(key)) {
      duplicates.push({
        index: index + 1,
        question: question.question,
        originalIndex: uniqueQuestions.get(key).index
      });
    } else {
      uniqueQuestions.set(key, {
        ...question,
        index: index + 1
      });
    }
  });
  
  // Convertir le Map en tableau
  const cleanedQuestions = Array.from(uniqueQuestions.values()).map(q => ({
    question: q.question,
    options: q.options,
    answer: q.answer,
    category: q.category,
    difficulty: q.difficulty
  }));
  
  // Afficher les statistiques
  console.log('\n📈 STATISTIQUES DU NETTOYAGE:');
  console.log(`✅ Questions originales: ${questions.length}`);
  console.log(`✅ Questions uniques: ${cleanedQuestions.length}`);
  console.log(`❌ Doublons supprimés: ${duplicates.length}`);
  console.log(`📊 Questions restantes: ${cleanedQuestions.length}`);
  
  // Afficher les doublons détectés
  if (duplicates.length > 0) {
    console.log('\n🔍 DOUBLONS DÉTECTÉS:');
    duplicates.forEach(dup => {
      console.log(`  - Question ${dup.index}: "${dup.question}" (doublon de la question ${dup.originalIndex})`);
    });
  }
  
  // Sauvegarder le fichier nettoyé
  fs.writeFileSync(outputPath, JSON.stringify(cleanedQuestions, null, 2), 'utf8');
  
  console.log(`\n💾 Fichier nettoyé sauvegardé: ${outputPath}`);
  
  // Vérifier si on a assez de questions pour 10 jours
  const questionsNeeded = 10 * 10; // 10 jours × 10 questions
  if (cleanedQuestions.length >= questionsNeeded) {
    console.log(`✅ SUFFISANT: ${cleanedQuestions.length} questions pour ${Math.floor(cleanedQuestions.length / 10)} jours complets`);
  } else {
    console.log(`⚠️  INSUFFISANT: ${cleanedQuestions.length} questions (${questionsNeeded - cleanedQuestions.length} questions manquantes pour 10 jours)`);
  }
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error);
} 