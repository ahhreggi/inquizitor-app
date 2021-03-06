/* eslint-disable */

// Append a question component to the given element
const addQuestionComponent = (element, additionalResponses = 2) => {

  let str = `
    <div class="form-group new-question d-flex flex-column">
      <header class="d-flex flex-row justify-content-between">
        <label for="question" class="question-label form-label text-muted mt-2">Question</label>
      </header>
      <span class="min-question"></span>
      <input class="input-question form-control" type="text" name="question" maxlength="250">
      <div class="responses">
        <label for="answer" class="form-label text-muted mt-2">Correct Answer</label>
        <input class="input-response form-control" type="text" maxlength="250">
        <label for="answer" class="form-label text-muted mt-2">Incorrect Answers</label>
        <input class="input-response form-control" type="text" maxlength="250">
  `;

  // Add additional response options (base minimum of 2 in total)
  for (let i = 0; i < additionalResponses; i++) {
    str += "<input class=\"input-response form-control mt-3\" type=\"text\" maxlength=\"250\">";
  }

  str += `
      </div>
      <div class="d-flex flex-row justify-content-between mt-3 p-0">
        <button type="button" class="toggle minimize btn-custom btn-custom-blue btn-custom-md m-0">Hide</button>
        <button type="button" class="btn-custom btn-custom-red btn-custom-md del-btn m-0">Delete</button>
      </div>
    </div>
  `;

  const $newForm = $(str);

  // Bind a click event handler to the delete button
  const deleteBtn = $newForm.find(".del-btn");
  $(deleteBtn).bind("click", function() {
    const component = $(this).closest(".new-question");
    removeElement(component);
    setTimeout(() => {
      updateCounter();
    }, 800);
  });

  // Bind a click event handler to the show/hide form toggler
  $($newForm).bind("click", function(event) {
    const $target = $(event.target);
    // Minimize the form
    if ($($target).is(".toggle.maximize")) {
      $(this).find(".min-question").html("");
      $(this).find("input").slideDown();
      $(this)
        .find(".responses")
        .slideDown();
      $(this)
        .find(".toggle")
        .html("Hide")
        .removeClass("maximize")
        .addClass("minimize");
      // Expand the form
    } else if ($($target).is(".toggle.minimize")) {
      const question = $(this).find("input");
      const answer = $(this).find(".input-response:first");
      $(this).find(".min-question")
        .css("opacity", "0")
        .html(`
        <p class="lead">${getValue(question) || "N/A"}</p>
        <p class="mb-0">Answer: ${getValue(answer) || "N/A"}</p>
      `)
        .animate({
          queue: true,
          opacity: 1
        }, {
          duration: 500
        });
      $(this).find("input").slideUp();
      $(this).find(".responses").slideUp();
      $(this)
        .find(".toggle")
        .html("Show")
        .removeClass("minimize")
        .addClass("maximize");
    }
  });

  // Add the form to the all questions container
  $newForm.css("display", "none").css("min-height", "0");
  element.append($newForm);
  addElement($newForm);

  updateCounter();

};

// Update the question counter
const updateCounter = () => {

  const num = getNumQuestions();
  $("#questions-counter")
    .html(`Questions${num ? ` ( ${num} )` : ""}`);

  updateLabels();

};

// Update the question form # labels
const updateLabels = () => {

  let number = 1;
  for (const component of $(".question-label")) {
    $(component).html(`Question #${number}`);
    number++;
  }

};

// Return the number of questions
const getNumQuestions = () => {

  return $("#add-questions").children().length;

};

// Display any field errors
const showError = (errorMsg) => {

  const errorComponent = $("#new-quiz-error");
  if (errorMsg) {
    errorComponent.html(errorMsg);
    errorComponent.removeClass("d-none").addClass("d-flex");
  } else {
    errorComponent.empty();
    errorComponent.removeClass("d-flex").addClass("d-none");
  }

};

// Return an error if a question for is invalid and change visual appearance
const getQuestionFormErrors = (minQuestions = 2, minResponses = 4) => {

  let error = null;

  const numQuestions = getNumQuestions();
  if (numQuestions < minQuestions) {
    error = `Minimum of ${minQuestions} questions must be provided`;
  }

  const allQuestions = $(".input-question");
  for (const question of allQuestions) {
    let valid = true;
    const userQuestion = $(question).val().trim();
    // Questions may not be non-empty
    if (userQuestion.length < 1) {
      error = "Question field may not be empty";
      valid = false;
    } else if (userQuestion.length > 250) {
      error = "Question field exceeds 250-character limit";
      valid = false;
    }
    const responses = $(question).next().find(".input-response");
    for (const response of responses) {
      const userResponse = $(response).val().trim();
      // Responses may not be non-empty
      if (userResponse.length < 1) {
        error = "Response field may not be empty";
        valid = false;
      } else if (userResponse.length > 250) {
        error = "Response field exceeds 250-character limit";
        valid = false;
      }
    }

    // Check for the minimum number of responses
    if (responses.length < minResponses) {
      error = `Minimum of ${minResponses} responses per question must be provided`;
      valid = false;
    }

    // Highlight question forms green/red on submit attempt if they are valid/invalid
    $(question).closest(".new-question")
      .css("border-color", valid ? "#31f37b" : "#e22d4b")
      .css("background-color", valid ? "#002c118e" : "#250006c7")
      .addClass(valid ? "valid-question" : "invalid-question");

    // Force expand invalid questions and collapse valid questions
    $(".invalid-question .maximize").trigger("click");
    $(".valid-question .minimize").trigger("click");

  }

  return error;

};

// Return an error message if the form is invalid
const getQuizFormErrors = () => {

  let error = null;
  const title = getValue("#quiz-title");
  const desc = getValue("#quiz-desc");
  const categoryIDs = ["1", "2", "3"];
  const category = getValue("#quiz-category");
  const publicValues = ["true", "false"];
  const visibility = getValue("#quiz-visibility");

  if (!title || !desc || !category || !visibility) {
    error = "Missing required fields";
  } else {
    if (title.length > 30) {
      error = "Title exceeds 30-character limit";
    } else if (desc.length > 60) {
      error = "Description exceeds 60-character limit";
    } else if (!categoryIDs.includes(category)) {
      error = "Invalid category value";
    } else if (!publicValues.includes(visibility)) {
      error = "Invalid visibility value";
    }
  }

  return error;

};

// Retrieve and sanitize an input field's value
const getValue = (inputField, escape = true) => {

  const string = $(inputField).val().trim();
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(string));
  return escape ? div.innerHTML : div.innerHTML.replace("&lt;", "<").replace("&gt;", ">");

};

// Submit form handler
const submitForm = () => {

  // Retrieve quiz info form data
  const title = getValue("#quiz-title");
  const description = getValue("#quiz-desc");
  const category_id = getValue("#quiz-category");
  const public = getValue("#quiz-visibility");

  // Retrieve quiz question form data
  const questions = [];
  const allQuestions = $(".input-question");
  for (const questionField of allQuestions) {
    const questionValue = getValue(questionField, true);
    const responseFields = $(questionField).next().find(".input-response");
    const responseValues = [];
    for (const responseField of responseFields) {
      const responseValue = getValue(responseField, true);
      const answer = {
        body: responseValue
      };
      responseValues.push(answer);
    }
    const question = {
      body: questionValue,
      answers: responseValues
    };
    questions.push(question);
  }

  // Submit a post request with the quiz data
  $.ajax({
    url: "/quizzes",
    type: "POST",
    data: {
      title,
      description,
      category_id,
      public,
      questions
    }
  })
    .then(quizID => {
      // On successful quiz submission, redirect to the new quiz show page
      setTimeout(() => {
        window.location.replace(`/quizzes/${quizID}`);
      }, 500);
    });

};

$(document).ready(function() {

  const questionsList = $("#add-questions");
  const addQuestionBtn = $(".add-btn");
  const quizForm = $("#new-quiz-form");

  // Add an initial question form
  addQuestionComponent(questionsList);

  // Add a new question when the user clicks the add question button
  addQuestionBtn.on("click", function() {

    addQuestionComponent(questionsList);

  });

  // On submit, check for form errors prior to submitting a POST request
  quizForm.on("submit", function(event) {

    event.preventDefault();

    // Display any form errors
    const error = getQuizFormErrors() || getQuestionFormErrors();
    showError(error);

    // If there are no errors, construct data to be sent to the server
    if (!error) {
      submitForm();
    }

  });

  // Clear question validation highlights and error messages on user input
  quizForm.on("input", function() {

    $(this).find(".new-question")
      .css("border-color", "#fff")
      .css("background-color", "#11121b")
      .removeClass("valid-question").removeClass("invalid-question");
    showError(false);

  });

});