const wordPairsDto = (wordPairs) => {
  return {
    id: wordPairs._id,
    userId: wordPairs.userId,
    title: wordPairs.title,
    visited: wordPairs.visited,
    totalWords: wordPairs.totalWords,
    lastResult: wordPairs.lastResult,
    pairsWord: wordPairs.pairsWord.map((p) => ({
      id: p.id,
      foreign: p.foreign,
      native: p.native,
      transcription: p.transcription,
      mastered: p.mastered,
      correctAnswers: p.correctAnswers,
      correctlyWritted: p.correctlyWritted
    })),
  };
};

export default wordPairsDto;
