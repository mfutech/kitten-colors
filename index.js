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

var app = new Vue({
  el: '#EMSCodeTranslator',
  data: {
    color: {},
    colors_error: false,
    patterns_error: false,
    unknown: "",
    ems_code: 'n',
    genotype: "",
  },

  methods: {
    do_translation: function () {
      this.color = ems_translate(this.ems_code);
      this.genotype = ems_genotype(this.ems_code);
    }
  },
  computed: {
    translated_color: function () {
      this.color = ems_translate(this.ems_code);
      this.colors_error = this.color.colors_error.length > 0;
      this.patterns_error = this.color.patterns_error.length > 0;
      return this.color.full_color;
    },
    translated_genotype: function () {
      this.genotype = ems_genotype(this.ems_code);
      return this.genotype;
    }
  }
});

var breeding = new Vue({
  el: '#Breeding',
  data: {
    father_ems: "n",
    father_color: {},
    father_genotype: "",
    mother_ems: "n",
    mother_color: {},
    mother_genotype: "",
    father_colors_error: false,
    father_patterns_error: false,
    mother_colors_error: false,
    mother_patterns_error: false,
    father_parsed_genotype: {},
    mother_parsed_genotype: {},
    father_parsed_genotype_error: false,
    mother_parsed_genotype_error: false,
    kitten_colors: [],
    currentSort: 'color',
    currentSortDir: 'asc'
  },
  methods: {
    do_breeding: function () {
      this.kitten_colors = ems_breeding_genotype(this.father_parsed_genotype, this.mother_parsed_genotype)
    },
    sort: function (s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = s;
    }
  },
  computed: {
    father_translated_color: function () {
      this.father_color = ems_translate(this.father_ems);
      this.father_colors_error = this.father_color.colors_error.length > 0;
      this.father_patterns_error = this.father_color.patterns_error.length > 0;
      this.father_genotype = ems_genotype(this.father_ems, 'male');
      return this.father_color.full_color;
    },
    mother_translated_color: function () {
      this.mother_color = ems_translate(this.mother_ems);
      this.mother_colors_error = this.mother_color.colors_error.length > 0;
      this.mother_patterns_error = this.mother_color.patterns_error.length > 0;
      this.mother_genotype = ems_genotype(this.mother_ems, 'female');
      return this.mother_color.full_color;
    },
    father_translated_genotype: function () {
      this.father_genotype = ems_genotype(this.father_ems, 'male');
      return this.father_genotype;
    },
    mother_translated_genotype: function () {
      this.mother_genotype = ems_genotype(this.mother_ems);
      return this.mother_genotype;
    },
    father_recomputed_genotype: function () {
      return parse_genotype(this.father_genotype);
    },
    sortedKitten: function () {
      if (this.kitten_colors.colors) { // object is initialized
        return this.kitten_colors.colors.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === 'desc') modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      }
      else {
        return [];
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    father_genotype: function (new_genotype, old) {
      this.father_parsed_genotype = parse_genotype(new_genotype);
      this.father_parsed_genotype_error = (this.father_parsed_genotype.genes_error.length > 0);
      this.do_breeding();
    },
    mother_genotype: function (new_genotype, old) {
      this.mother_parsed_genotype = parse_genotype(new_genotype);
      this.mother_parsed_genotype_error = (this.mother_parsed_genotype.genes_error.length > 0);
      this.do_breeding();
    },
  }
});

