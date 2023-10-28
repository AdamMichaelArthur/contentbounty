

async function loadStripe(client_secret, paymentAccepted, self, baseUrl) {

	console.log(3, "loadStripe Called", paymentAccepted);
	var stripe = Stripe('pk_test_nXe9cSnVNkXqFWgEJEcyxz6s');
	var elements = stripe.elements();

		// Set up Stripe.js and Elements to use in checkout form
	var style = {
	  base: {
	    color: "#32325d",
	    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
	    fontSmoothing: "antialiased",
	    fontSize: "16px",
	    "::placeholder": {
	      color: "#aab7c4"
	    }
	  },
	  invalid: {
	    color: "#fa755a",
	    iconColor: "#fa755a"
	  }
	};

	var card = elements.create("card", { style: style });
	card.mount("#card-element");

	// stripe.createPaymentMethod({
	//   type: 'card',
	//   card: cardElement,
	//   billing_details: {
	//     email: 'jenny.rosen@example.com',
	//   },
	// }).then(function(result) {
	//   // Handle result.error or result.paymentMethod
	// });

    // this.card.addEventListener('change', ({ error }) => {
    //   const displayError = document.getElementById('card-errors');
    //   if (error) {
    //     self.stripeError(error.message);
    //   }
    // });

    card.addEventListener('change', (event) => {
      if (event.complete) {
        this.visiblePaynow = true;
        self.stripeDidFinishEnteringCardInfo(event)
      }
    });

	card.addEventListener('change', function(event) {
	  var displayError = document.getElementById('card-errors');
	  if (event.error) {
	    displayError.textContent = event.error.message;
	    self.stripeDidReportError(event)
	  }
	});

    card.addEventListener('ready', () => {
    	console.log(64, "ready")
      console.log(378, 'ready received',
        elements);

      var cardElement = elements.getElement('card');
      setTimeout(function(){
          console.log("Trying to focus");
          cardElement.focus()
      }, 1000, cardElement)
      self.stripeIsReady()
      
    })

	var submitButton = document.getElementById('submit');

	submitButton.addEventListener('click', function(ev) {
	  //console.log(32, `ret data: ${card}`);
		  stripe.createPaymentMethod({
		  		type: 'card',
		  		card: card,
		  		}
		  ).then(function(result){
		  			self.paymentMethodAdded(result.paymentMethod)
		  	// 		const Http = new XMLHttpRequest();
					// const url=baseUrl + '/stripe/method';
					// Http.open("POST", url);
					// Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

					// var payload = {
					// 	"paymentMethod": result.paymentMethod
					// }

					// Http.send(JSON.stringify(payload));
					// console.log(68, result.paymentMethod);
					// Http.onreadystatechange = (e) => {
					// 	if(Http.readyState == 4){
							
					//   }
					// }

		  });
	  });
	self.stripeFinishedLoading(stripe, elements);
}
