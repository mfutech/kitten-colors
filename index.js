var app = new Vue({
  el: '#EMSCodeTranslator',
  data: {
    color: '--',
    unknown: "",
    ems_code: '',
  },

  methods: {
    do_translation: function () {
      this.color = ems_translate(this.ems_code);
    }
  }
});

color_names = {
  'n': 'noir',
  'a': 'bleu',
  'f': 'black tortie',
  'g': 'blue tortie',
  'b': 'chocolat',
  'c': 'lilas',
  'h': 'chocolat tortie',
  'j': 'lilac tortie',
  'o': 'cinnamon',
  'p': 'fawn',
  'q': 'cinnamon tortie',
  'r': 'fawn tortie',
  'd': 'roux',
  'e': 'crème',
  'w': 'blanc',
  's': 'silver/smoke',
  't': 'ambre',
  'y': 'golden',
  'u': 'sunshine',
};

// translation table patterns 
pattern_names = {
  '11': 'shaded',
  '12': 'shell/chinchilla',
  '21': 'tabby sans précision de motif',
  '22': 'blotched tabby',
  '23': 'mackerel tabby',
  '24': 'spotted tabby',
  '25': 'tic',
  '33': 'point',
  '31': 'sepia',
  '32': 'mink',
  '01': '& blanc van',
  '02': '& blanc arlequin',
  '03': '& blanc (pour les bicolores)',
  '04': 'mitted',
  '09': '& blanc (sans indication de quantité de blanc)',
  // and eyes colors
  '61': 'yeux bleus',
  '62': 'yeux or',
  '63': 'yeux impairs',
  '64': 'yeux verts',
  '66': 'yeux aigue-marine',
}

function ems_translate(ems_code) {
  // split code by space
  code_list = ems_code.split(/\s+/);

  // first element are letters giving the color name
  color = code_list[0];
  // all other element are number describing patterns
  pattern_list = code_list.slice(1);

  // translate letter into colornmaes
  colors = color.split("").map(function (letter) {
    return color_names[letter];
  });

  // translate numbers into patterns names
  patterns = pattern_list.map(function (modifier) {
    return pattern_names[modifier];
  });

  // contruct full color name
  full_color = colors.join(" ") + " " + patterns.join(" ");
  return full_color;
}

/*

class EMSCode {
    static const colors = {
      'n':	'noir',
      'a':	'bleu',
      'f':	'black tortie',
      'g':	'blue tortie',
      'b':	'chocolat',
      'c':	'lilas',
      'h':	'chocolat tortie',
      'j':	'lilac tortie',
      'o':	'cinnamon',
         'p':	'fawn',
      'q':	'cinnamon tortie',
      'r':	'fawn tortie',
      'd':	'roux',
      'e':	'crème',
      'w':	'blanc',
      's':	'silver/smoke',
      't':	'ambre',
      'y':	'golden',
      'u':  'sunshine',
    };

    static const pattern = {
      '11':	'shaded',
      '12':	'shell/chinchilla',
      '21':	'tabby sans précision de motif',
      '22':	'blotched tabby',
      '23':	'mackerel tabby',
      '24':	'spotted tabby',
      '25':	'tic',
      '33': 'point',
      '31':	'sepia',
      '32':	'mink',
      '01':	'& blanc van',
      '02':	'& blanc arlequin',
      '03':	'& blanc (pour les bicolores)',
      '04':	'mitted',
      '09':	'& blanc (sans indication de quantité de blanc)',
    };
    static const eyes_color = {
      '61':	'yeux bleus',
      '62':	'yeux or',
      '63':	'yeux impairs',
      '64':	'yeux verts',
      '66':	'yeux aigue-marine',
    };

    String code;
    String translation = "";
    String unrecognized = "";
    bool valid = true;
    EMSCode (this.code) {
      this.translation = translate();
      this.valid = (this.unrecognized.length == 0 );

    }

    String translate ( ) {
      var codeList = this.code.split(" ");
      // first code is the color
      var color = codeList[0];
      for (var i = 0; i < color.length; i++) {
        var k = color[i];
        if (colors.containsKey(k))
          this.translation += colors[k] + " ";
        else
          this.unrecognized += k;
      }
      // other codes are patterns
      for (var i = 1; i < codeList.length; i++ ) {
        var k = codeList[i];
        //this.unrecognized += "##" + k + "##";
        if ( pattern.containsKey(k) )
          this.translation += ", " + pattern[k];
        else
          this.unrecognized += " (" + k + ") ";
      }
      return this.translation;
    }

    static bool checkCode( String code )  {
      var error = false;
      if (! colors.containsKey(code[0]))
        error = true;

      return ! error;
    }
  }

*/
