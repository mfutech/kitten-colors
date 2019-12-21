/** Kitten Genotype Calculator
    Copyright (C) 2019 Marc Furrer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
**/

/*
    ems_translator.js
    
    Author: Marc Furrer, 2019

    This package tries de translate an EMS color code into words that
    describe color of a cat. Speaks french for the time beeing.
    Only relevant for cats, from common breeds.
*/

// translation table for colors
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
  
  color_names_unknown_genotype = {
    'w': 'blanc',
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
  pattern_names_unknown_genotype = {
    '11': 'shaded',
    '12': 'shell/chinchilla',
    '25': 'tic',
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
  
  function ems_parse (ems_code) {
    // split code by space
    code_list = ems_code.toLowerCase().split(/\s+/);
  
    // first element are letters giving the color name
    color = code_list[0];
    // all other element are number describing patterns
    pattern_list = code_list.slice(1).filter( e=> e.length>0 );
    
    return {
        "color": color,
        "patterns": pattern_list,
    };
  };

  function ems_translate(ems_code) {

    ems = ems_parse(ems_code);
    let colors_error = [];
    let ems_no_genotype = [];
  
    // translate letter into colornmaes
    colors = ems.color.split("").map(function (letter) {
      c = color_names[letter];
      if (! c) {
        colors_error.push(letter);
      };
      if (color_names_unknown_genotype[letter]){
        ems_no_genotype.push(letter);
      }
      return c;
    });
  
    // translate numbers into patterns names
    let patterns_error = [];

    patterns = ems.patterns.map(function (modifier) {
      p = pattern_names[modifier];
      if (!p){
        patterns_error.push(modifier);
      };
      if (pattern_names_unknown_genotype[modifier]) {
        ems_no_genotype.push(modifier);
      }
      return p;
    });
  
    // contruct full color name
    return {
      full_color: colors.join(" ") + " " + patterns.join(" "),
      patterns: patterns,
      colors: colors,
      colors_error: colors_error,
      patterns_error: patterns_error,
      ems_no_genotype: ems_no_genotype,
    };
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