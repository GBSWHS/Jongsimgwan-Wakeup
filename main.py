from ytmusicapi import YTMusic
import json
import sys

ytmusic = YTMusic('./auth.json')

title = sys.argv
del title[0]
search_results = ytmusic.search(" ".join(title), filter="songs")
print(json.dumps(search_results))