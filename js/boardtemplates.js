/**
 * Renders all tasks for a given section.
 * @param {Object} section - The section object containing the ID and empty message for the section.
 * @param {Array} tasksForSection - The array of tasks to be rendered for the given section.
 */
function renderTasksForSection(section, tasksForSection) {
    const container = document.getElementById(section.id);
    container.innerHTML = "";
    if (tasksForSection.length === 0) {
      container.innerHTML = genereteNoTasks(section.emptyMessage);
    } else {
      tasksForSection.forEach((task) => {
        container.innerHTML += generateTodoHTML(task);
        calculateSubTasks(task);
        generateInitals(task);
      });
    }
  }

/**
 * Sets the style of a priority button based on the given color and SVG path, and updates the taskEdit object with the new priority.
 * @param {HTMLElement} button - The priority button element to be styled.
 * @param {string} svgId - The ID of the SVG element to be updated.
 * @param {string} color - The background color to be set for the button.
 * @param {string} svgPath - The path to the SVG file to be used for the button.
 * @param {string} priority - The priority value to be set for the taskEdit object.
 */
  function setPriorityStyle(button, svgId, color, svgPath, priority) {
    button.style.backgroundColor = color;
    button.style.color = "white";
    document.getElementById(svgId).src = svgPath;
    taskEdit.prio = priority;
  }
  
/**
 * Resets the style of a priority button to its default state.
 * @param {HTMLElement} button - The priority button element to be reset.
 * @param {string} svgId - The ID of the SVG element to be reset.
 * @param {string} svgPath - The path to the SVG file to be used for the button.
 */
  function resetPriorityStyle(button, svgId, svgPath) {
    button.style.backgroundColor = "transparent";
    button.style.color = "black";
    document.getElementById(svgId).src = svgPath;
  }