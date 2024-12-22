from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def analyze_text(text: str) -> dict:
    """Analyze sentiment of a single text."""
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    
    # Determine sentiment label
    if scores['compound'] >= 0.05:
        sentiment = 'positive'
    elif scores['compound'] <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return {
        'text': text,
        'sentiment': sentiment,
        'scores': scores
    }

def batch_analyze_texts(texts: list) -> list:
    """Analyze sentiment of multiple texts."""
    return [analyze_text(text) for text in texts]
