Vue.use(window.vuelidate.default)

const pizzaOrBurger =  value => value === 'pizza' || value === 'burger' || !validators.helpers.req(value)
const oldEnoughAndAlive = validators.between(12, 120)

new Vue({
  el: '#app',

  data () {
    return {
      form: {
        name: null,
        age: null,
        email: null,
        food: null,
        githubUsername: null,
        newsletter: false
      }
    }
  },

  validations: {
    form: {
      name: {
        required: validators.required
      },
      age: {
        required: validators.required,
        number: validators.integer,
        oldEnoughAndAlive
      },
      email: {
        email: validators.email,
        required: validators.requiredIf(function() {
          return !!this.form.newsletter
        })
      },
      githubUsername: {
        exists(value) {
          if (!validators.helpers.req(value)) {
            return true
          }

          return axios.get(`//api.github.com/users/${value}`);

          // return new Promise((resolve, reject) => {
          //   setTimeout(() => {
          //     resolve(value.length > 3)
          //   }, 1000);
          // })
        }
      },
      food: {
        pizzaOrBurger
      }
    }
  },

  methods: {
    shouldAppendValidClass(field) {
      return !field.$invalid && field.$model && field.$dirty
    },

    shouldAppendErrorClass(field) {
      return field.$error
    },

    submitForm () {
      this.$v.form.$touch()
      if (!this.$v.form.name.$invalid) {
        console.log('📝 Form Submitted', this.form)
      } else {
        console.log('❌ Invalid form')
      }
    }
  }
})  