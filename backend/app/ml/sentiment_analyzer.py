"""
Patient Review & Feedback Sentiment Analyzer
Evaluates review text for efficacy sentiment and side-effect severity.
"""

from typing import Dict, Any, List

class FeedbackSentimentAnalyzer:
    def __init__(self):
        self.positive_keywords = {
            "effective", "relief", "helped", "improved", "cured", "great", "better", "safe",
            "working", "excellent", "reduced", "normal", "healthy", "life saver", "good"
        }
        self.negative_keywords = {
            "side effect", "nausea", "headache", "dizzy", "allergic", "vomiting", "pain",
            "rash", "severe", "worse", "ineffective", "bad", "terrible", "bleeding"
        }

    def analyze_feedback(self, text: str, rating: int = None) -> Dict[str, Any]:
        text_lower = text.lower()
        pos_count = sum(1 for word in self.positive_keywords if word in text_lower)
        neg_count = sum(1 for word in self.negative_keywords if word in text_lower)

        # Baseline score from text
        if pos_count + neg_count == 0:
            text_score = 0.50
        else:
            text_score = pos_count / (pos_count + neg_count)

        # Combine with explicit numerical rating (1-10)
        if rating is not None:
            rating_score = max(0.0, min(1.0, rating / 10.0))
            composite_score = round(0.6 * text_score + 0.4 * rating_score, 3)
        else:
            composite_score = round(text_score, 3)

        if composite_score >= 0.65:
            label = "POSITIVE"
        elif composite_score <= 0.40:
            label = "NEGATIVE"
        else:
            label = "NEUTRAL"

        return {
            "sentiment_score": composite_score,
            "sentiment_label": label,
            "positive_signals": pos_count,
            "negative_signals": neg_count
        }

sentiment_analyzer = FeedbackSentimentAnalyzer()
