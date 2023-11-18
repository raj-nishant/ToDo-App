const content = document.querySelector(".content");
const taskDoneContainer = document.querySelector("#taskDoneContainer");

const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const submit = document.querySelector("#submit");

function moveToDoneContainer(dataContainer) {
  const buttons = dataContainer.querySelectorAll("button");
  buttons.forEach((button) => button.remove());

  taskDoneContainer.appendChild(dataContainer);
}

// Display data
function displayData(data) {
  const { name, description, _id, isDone } = data;

  // Create a container div for each set of data and the delete button
  const dataContainer = document.createElement("div");
  // Display the data inside the container
  dataContainer.innerHTML = `<p><strong>Task Name:</strong> ${name}</p><p><strong>Task Description:</strong> ${description}</p>`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";
  dataContainer.appendChild(deleteButton);

  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  dataContainer.appendChild(doneButton);

  // Append the container to the content element or Task Done container based on isDone
  if (isDone) {
    moveToDoneContainer(dataContainer);
  } else {
    content.appendChild(dataContainer);
  }

  deleteButton.addEventListener("click", () => {
    deleteData(_id);
    // Remove the container from the DOM after deletion
    content.removeChild(dataContainer);
  });

  doneButton.addEventListener("click", async () => {
    await doneData(_id);
    moveToDoneContainer(dataContainer); // Move the data to the "Task Done" container
  });
}

// Done request
function doneData(id) {
  axios
    .put(
      `https://crudcrud.com/api/9b9f82f55bfe4384901dc2a18610557a/todo/${id}`,
      {
        isDone: true,
      }
    )
    .catch((error) => {
      console.error("Error updating isDone property:", error);
    });
}

//delete request
function deleteData(id) {
  axios
    .delete(
      `https://crudcrud.com/api/9b9f82f55bfe4384901dc2a18610557a/todo/${id}`
    )
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
}

// Post request
function postData(name, description) {
  axios
    .post("https://crudcrud.com/api/9b9f82f55bfe4384901dc2a18610557a/todo", {
      name,
      description,
      isDone: false, // Set isDone to false by default
    })
    .then((todoData) => displayData(todoData.data))
    .catch((error) => console.log("error"));
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const description = descriptionInput.value;

  if (name && description) {
    postData(name, description);
    nameInput.value = "";
    descriptionInput.value = "";
  } else {
    alert("please fill all the input areas");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://crudcrud.com/api/9b9f82f55bfe4384901dc2a18610557a/todo")
    .then((res) => {
      const userDataArray = res.data;

      userDataArray.forEach((userData) => {
        displayData(userData);
      });
    })
    .catch((error) => {
      document.getElementById("content").innerText = error.message;
    });
});
