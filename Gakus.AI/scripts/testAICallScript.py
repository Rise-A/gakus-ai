from google import genai

apiKey = input("Enter your Google Gemini API Key: ")
client = genai.Client(api_key=apiKey)

aiParameters = ""

response = client.models.generate_content(
    model="gemini-3-flash-preview", contents="Explain how AI works in a few words, and say it in Romaji and hiragana"
)

# Will be converted to proper formatting for Note cards
# The AI won't be the one doing the SQL data insertions
print(response.text)
