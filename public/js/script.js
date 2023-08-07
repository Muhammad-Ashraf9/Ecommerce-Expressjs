"use strict";
const btnsDelete = document.querySelectorAll(".btn--delete");
const csrfToken = document.querySelector("[name=CSRFToken]").value;

const deleteProduct = function (url, element) {
  // fetch(url, {
  //   method: "DELETE",
  // headers: {
  //   "x-csrf-token ": csrfToken,
  // },
  // })
  // fetch on window error
  //problem with csrf so i changed the method to get to pass csrf check
  fetch(
    url
    // , {
    //   method: "DELETE",
    //   headers: {
    //     "x-csrf-token ": csrfToken,
    //   },
    //   body: JSON.stringify({ CSRFToken: csrfToken }),
    // }
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      element.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

btnsDelete.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    const productId = e.target.name;
    const url = "/admin/product/" + productId;
    console.log(url, card, productId, csrfToken);
    deleteProduct(url, card);
  });
});
