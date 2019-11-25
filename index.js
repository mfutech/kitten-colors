var app = new Vue({
  el: '#EMSCodeTranslator',
  data: {
    color: '--',
    unknown: "",
    ems_code: '',
    genotype: "",
  },

  methods: {
    do_translation: function () {
      this.color = ems_translate(this.ems_code);
      this.genotype = ems_genotype(this.ems_code);
    }
  }
});

var breeding = new Vue({
  el: '#Breeding',
  data: {
    father_ems: "",
    father_color: "",
    father_genotype: "",
    mother_ems: "",
    mother_color: "",
    mother_genotype: "",
    kitten_colors: ["-", "-"],
  },
  methods: {
    do_breeding: function () {
      this.father_color = ems_translate(this.father_ems);
      this.father_genotype = ems_genotype(this.father_ems, 'male');
      this.mother_color = ems_translate(this.mother_ems);
      this.mother_genotype = ems_genotype(this.mother_ems, 'female');
      this.kitten_colors = ems_breeding(this.father_ems, this.mother_ems)
    }
  }
});

