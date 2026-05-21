from google import genai
import json

apiKey = input("Enter your Google Gemini API Key: ")
client = genai.Client(api_key=apiKey)

response = client.models.generate_content(
    model="gemini-3-flash-preview", 
    contents=
    """
    Translate the following into Japanese: garstmarst. 
    
    Respond ONLY with THIS EXACT valid JSON format. 
    
    If there's any kanji/jukugo in the rawText, for each instance of kanji/jukugo, store them in the "rubyText" field according to the specified JSON Object Array format, adding them in order in which they appear in the rawText. Otherwise, make the entire "rubyText" field null.
    
    Otherwise, ONLY change the text in between the chevrons: 

    {
        "englishText": <INSERT UNALTERED USER INPUT TEXT HERE>,
        "romajiText": "<INSERT ROMAJI HERE>",
        "japaneseText": {
            "rawText": "<INSERT RAW JAPANESE TEXT HERE>",
            "rubyText": [
                {
                    "id": 1,
                    "furigana": "<INSERT FURIGANA HERE>",
                    "kanji": "<KANJI/JUKUGO GOES HERE>"
                }
            ]
        }
    }
    """
)

# when splitting up segments for rubytext, it's probably best to do it not via AI, to reduce on token usage, and to make it minimally reliant on AI as much as possible.
# instead, have the AI also return an array of hiragana that represents each Kanji in the sentence.

parsed = json.loads(response.text)  
json_str = json.dumps(parsed, indent=3, ensure_ascii=False)  

with open("sample.json", "w", encoding="utf-8") as f:
    f.write(json_str)

# Will be converted to proper formatting for Note cards
# The AI won't be the one doing the SQL data insertions
print(response.text)
