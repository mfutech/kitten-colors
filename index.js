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

