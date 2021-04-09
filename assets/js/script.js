var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// $(".card.list-group").sortable({
//   connectWith: $(".card.list-group")
// });

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

//task text was clicked
$(".list-group").on("click", "p", function() {
  //get current text of p element
  var text = $(this)//.text().trim(); (could be used this way too)
    .text()
    .trim();
  //console.log(text);
  //console.log(this);

  //replace p element with a new textarea
  //textarea tells jQuery to find all existing textarea elements, 
  //<textarea> tells jQuery to create a new <textarea> element
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  $(this).replaceWith(textInput);

  //auto focus new element
  textInput.trigger("focus");
});

//editable field was un-focused
$(".list-group").on("blur", "textarea", function() {
  //get the textarea's current value/text
  var text = $(this).val()

  //get status type and position in the list
  //get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    //returning the ID
    .attr("id")
    //JavaScript operator to find and replace text in a string
    .replace("list-", "");
  //get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    //child elements are indexed starting at zero like arrays
    .index();

  //update task in array and re-save to localstorage
  //tasks is an object
  //tasks[status] returns an array
  //task[status][index] returns the object at the given index in the array
  //task[status][index].text returns the text property of the object at the given index
  tasks[status][index].text = text;
  saveTasks();

  //recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  //replace textarea with p element
  $(this).replaceWith(taskP);
});

//due date was clicked
$(".list-group").on("click", "span", function() {
  //get current text
  var date = $(this)
    .text()
    .trim();

  //create new input element
  var dateInput = $("<input>")
    //attr() with 1 argument, gets an attribute
    //attr() with 2 arguments, it sets an attribute
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  //swap out elements
  $(this).replaceWith(dateInput);

  //automatically focus on new element
  dateInput.trigger("focus");
});

//value of due date was change
$(".list-group").on("blur", "input[type='text']", function() {
  //get current text
  var date = $(this).val()

  //get the parent ul's id attribute
  var status = $(this)
    .closest (".list-group")
    .attr("id")
    .replace("list-", "");
  //get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  //update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  //recreate span element with boostrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
  //replace input with span element
  $(this).replaceWith(taskSpan);
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


