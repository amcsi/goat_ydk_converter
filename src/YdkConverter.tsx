import React, { useState, ChangeEvent, JSX } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

/**
 * YGOPro YDK Converter — Modern ⇄ GOAT (pre‑errata)
 *
 * Upload or paste a .ydk deck list, choose conversion direction,
 * then download the converted list. Identifiers not found in the
 * mapping remain unchanged so the tool is resilient to new cards.
 */

// Raw mapping provided by the user (modernID -> goatID)
const rawMapping = `
126218    -> 504700000
218704    -> 504700001
596051    -> 504700002
980973    -> 504700003
1689516   -> 504700004
1965724   -> 504700005
1995985   -> 504700006
2111707   -> 504700007
2926176   -> 504700133
6104968   -> 504700008
6390406   -> 504700009
6850209   -> 504700010
7512044   -> 504700011
8131171   -> 511000818
8964854   -> 504700012
9156135   -> 504700013
10035717  -> 504700014
11224103  -> 504700015
11760174  -> 504700016
12503902  -> 504700017
12923641  -> 504700018
13026402  -> 504700019
13604200  -> 504700020
14878871  -> 504700179
15013468  -> 504700021
15653824  -> 504700022
16227556  -> 511002982
16430187  -> 504700023
16762927  -> 504700024
17449108  -> 504700025
17655904  -> 504700026
17814387  -> 504700027
18190572  -> 504700028
19612721  -> 504700029
20436034  -> 504700030
21070956  -> 504700180
21593977  -> 21593987
22020907  -> 504700031
22359980  -> 504700032
22567609  -> 504700033
22873798  -> 504700034
22996376  -> 504700035
23118924  -> 504700036
23171610  -> 504700037
23205979  -> 504700038
23265313  -> 504700039
23265594  -> 511002851
23401839  -> 504700040
23401840  -> 504700040
23927567  -> 504700041
24140059  -> 504700042
24294108  -> 504700043
24317029  -> 504700044
25119460  -> 504700045
25290459  -> 504700046
26202165  -> 504700178
26902560  -> 504700047
26931058  -> 504700048
27770341  -> 504700049
29267084  -> 504700050
29389368  -> 504700051
29401950  -> 504700052
30314994  -> 504700053
31786629  -> 504700054
32807846  -> 504700055
32919136  -> 504700056
34088136  -> 504700057
34830502  -> 504700058
37580756  -> 504700059
37721209  -> 504700060
37957847  -> 504700061
38369349  -> 504700062
38552107  -> 504700063
39191307  -> 504700064
39892082  -> 504700065
40172183  -> 504700066
40240595  -> 504700067
40619825  -> 504700068
40737112  -> 511001039
41398771  -> 504700069
41925941  -> 504700070
43040603  -> 504700071
43586926  -> 511000868
44209392  -> 504700072
45547649  -> 504700073
45894482  -> 511003006
46363422  -> 504700074
46384672  -> 504700075
47025270  -> 504700076
47355498  -> 511002998
47507260  -> 504700077
47829960  -> 504700078
48148828  -> 504700079
49217579  -> 504700080
49441499  -> 504700081
49681811  -> 504700082
51402177  -> 504700083
52624755  -> 504700084
52684508  -> 504700085
53183600  -> 504700086
53839837  -> 504700087
54098121  -> 504700088
55348096  -> 504700089
56916805  -> 504700090
56948373  -> 504700091
57617178  -> 504700092
57839750  -> 504700093
57882509  -> 504700094
58551308  -> 504700095
58577036  -> 504700096
60102563  -> 504700097
60806437  -> 504700098
61441708  -> 504700099
61622107  -> 504700100
61740673  -> 511002996
62340868  -> 504700101
63519819  -> 504700102
63689843  -> 504700103
63995093  -> 504700104
64389297  -> 504700105
64500000  -> 511002853
64631466  -> 504700106
65240384  -> 65240394
65260293  -> 504700107
65458948  -> 504700108
65622692  -> 511002852
65878864  -> 504700109
68057622  -> 504700110
68540058  -> 504700111
68540059  -> 504700111
69122763  -> 504700112
69542930  -> 504700113
70046172  -> 504700114
70861343  -> 504700115
71044499  -> 504700116
71829750  -> 504700117
72989439  -> 504700118
73398797  -> 504700119
73431236  -> 504700120
73628505  -> 504700121
73752131  -> 504700122
73915051  -> 504700123
74137509  -> 504700124
74153887  -> 504700125
74388798  -> 504700126
74458486  -> 504700127
74591968  -> 504700128
74713516  -> 504700129
75043725  -> 511003027
75417459  -> 504700130
75745607  -> 504700131
75830094  -> 504700132
76754619  -> 504700134
77044671  -> 504700135
78010363  -> 504700144
78636495  -> 504700136
79109599  -> 504700137
79575620  -> 504700138
79853073  -> 504700139
80168720  -> 511003028
81210420  -> 504700140
82003859  -> 504700141
82301904  -> 511000819
83011277  -> 504700142
83011278  -> 504700142
83555666  -> 511000824
83555667  -> 511000824
83986578  -> 504700143
84834865  -> 504700145
85489096  -> 504700146
85602018  -> 504700147
86327225  -> 504700148
87210505  -> 504700149
87340664  -> 504700150
87473172  -> 504700151
87910978  -> 511002995
88472456  -> 504700152
88789641  -> 504700153
88989706  -> 504700154
89801755  -> 504700155
89997728  -> 504700156
90219263  -> 504700157
90846359  -> 504700158
90980792  -> 504700159
91842653  -> 504700160
91998119  -> 504700161
91998120  -> 504700161
91998121  -> 504700161
93107608  -> 504700162
93920745  -> 504700163
94568601  -> 504700164
94585852  -> 504700165
95132338  -> 504700166
95178994  -> 504700167
95214051  -> 504700168
95492061  -> 504700169
95727991  -> 511000228
95956346  -> 504700170
96316857  -> 511002983
96965364  -> 504700171
97017120  -> 504700172
98239899  -> 504700173
98434877  -> 504700174
98446407  -> 504700175
99414168  -> 504700181
99597615  -> 504700176
99724761  -> 504700177
`;

// Build look‑up objects once at module load.
const modernToGoat: Record<string, string> = {};
const goatToModern: Record<string, string> = {};
rawMapping.trim().split(/\n/).forEach((line) => {
  const match = line.match(/^(\d+)\s*->\s*(\d+)/);
  if (match) {
    const [, modern, goat] = match;
    modernToGoat[modern] = goat;
    if (!goatToModern[goat]) goatToModern[goat] = modern;
  }
});

export default function YdkConverter(): JSX.Element {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [direction, setDirection] = useState<"modernToGoat" | "goatToModern">(
    "modernToGoat"
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) file.text().then(setInputText);
  };

  const convert = () => {
    if (!inputText.trim()) return;
    const lines = inputText.split(/\r?\n/);
    const converted = lines.map((line) => {
      const id = line.trim();
      if (/^\d+$/.test(id)) {
        return direction === "modernToGoat"
          ? modernToGoat[id] || id
          : goatToModern[id] || id;
      }
      return line;
    });
    setOutputText(converted.join("\n"));
  };

  const download = () => {
    if (!outputText.trim()) return;
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      direction === "modernToGoat" ? "deck_goat.ydk" : "deck_modern.ydk";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardContent className="space-y-6 p-6">
          <h1 className="text-2xl font-bold text-center">YDK Format Converter</h1>

          <div className="space-y-2">
            <label className="block font-medium">Upload .ydk file</label>
            <input
              type="file"
              accept=".ydk"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">…or paste list</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste .ydk contents here…"
              className="w-full h-48 p-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <select
              value={direction}
              onChange={(e) =>
                setDirection(e.target.value as "modernToGoat" | "goatToModern")
              }
              className="p-2 border rounded w-full md:w-auto"
            >
              <option value="modernToGoat">Duelingbook ➜ EdoPro (GOAT)</option>
              <option value="goatToModern">EdoPro (GOAT) ➜ Duelingbook</option>
            </select>

            <Button onClick={convert} className="w-full md:w-auto">
              Convert
            </Button>
          </div>

          {outputText && (
            <>
              <div>
                <label className="block font-medium mb-1">Converted list</label>
                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-48 p-2 border rounded bg-gray-50"
                />
              </div>
              <Button onClick={download} className="w-full md:w-auto">
                Download .ydk
              </Button>
            </>
          )}
        </CardContent>

        <CardContent>
          <p className="text-center text-gray-500">
            <a href="https://github.com/amcsi/goat_ydk_converter" target="_blank" rel="noreferrer">
              Source code on GitHub
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
