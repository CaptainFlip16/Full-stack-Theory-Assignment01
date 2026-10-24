import Ticket from "./Ticket.js";

let tickets = [];

const domElements = {
  form: document.getElementById("ticket-form"),
  idInput: document.getElementById("ticket-id"),
  nameInput: document.getElementById("customer-name"),
  issueInput: document.getElementById("issue-desc"),
  priorityInput: document.getElementById("priority-level"),
  statusInput: document.getElementById("ticket-status"),
  ticketList: document.getElementById("ticket-list"),
  formTitle: document.getElementById("form-title"),
  saveBtn: document.getElementById("save-btn"),
  resetBtn: document.getElementById("reset-btn"),
  countOpen: document.getElementById("count-open"),
  countProgress: document.getElementById("count-progress"),
  countClosed: document.getElementById("count-closed"),
  searchKeyword: document.getElementById("search-keyword"),
  filterPriority: document.getElementById("filter-priority"),
  filterStatus: document.getElementById("filter-status"),
};

const updateSummary = () => {
  const counts = tickets.reduce(
    (acc, ticket) => {
      const { status } = ticket;
      if (status === "Open") acc.open++;
      else if (status === "In-Progress") acc.progress++;
      else if (status === "Closed") acc.closed++;
      return acc;
    },
    { open: 0, progress: 0, closed: 0 },
  );

  domElements.countOpen.textContent = counts.open;
  domElements.countProgress.textContent = counts.progress;
  domElements.countClosed.textContent = counts.closed;
};

const getBadgeClasses = (priority, status) => {
  const priorityClass =
    priority === "High"
      ? "text-bg-danger"
      : priority === "Medium"
        ? "text-bg-warning"
        : "text-bg-secondary";
  const statusClass =
    status === "Open"
      ? "text-bg-primary"
      : status === "In-Progress"
        ? "text-bg-warning"
        : "text-bg-success";

  return { priorityClass, statusClass };
};

const renderTickets = (dataToRender = tickets) => {
  domElements.ticketList.innerHTML = "";

  dataToRender.forEach((ticket) => {
    const { id, name, issue, priority, status } = ticket;
    const { priorityClass, statusClass } = getBadgeClasses(priority, status);

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>#${id}</td>
            <td class="fw-bold">${name}</td>
            <td>${issue}</td>
            <td><span class="badge ${priorityClass}">${priority}</span></td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-info text-white action-btn edit-btn" data-id="${id}">Edit</button>
                <button class="btn btn-sm btn-danger action-btn delete-btn" data-id="${id}">Delete</button>
            </td>
        `;
    domElements.ticketList.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => editTicket(e.target.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => deleteTicket(e.target.dataset.id));
  });

  updateSummary();
};

const filterTickets = () => {
  const keyword = domElements.searchKeyword.value.toLowerCase();
  const priorityFilter = domElements.filterPriority.value;
  const statusFilter = domElements.filterStatus.value;

  const filtered = tickets.filter((ticket) => {
    const { name, issue, priority, status } = ticket;
    const matchesKeyword =
      name.toLowerCase().includes(keyword) ||
      issue.toLowerCase().includes(keyword);
    const matchesPriority =
      priorityFilter === "" || priority === priorityFilter;
    const matchesStatus = statusFilter === "" || status === statusFilter;

    return matchesKeyword && matchesPriority && matchesStatus;
  });

  renderTickets(filtered);
};

const resetForm = () => {
  domElements.nameInput.value = "";
  domElements.issueInput.value = "";
  domElements.priorityInput.value = "Low";
  domElements.statusInput.value = "Open";
  domElements.idInput.value = "";

  domElements.formTitle.textContent = "Create New Ticket";
  domElements.saveBtn.textContent = "Save Ticket";
};

const saveTicket = (e) => {
  e.preventDefault();

  const name = domElements.nameInput.value.trim();
  const issue = domElements.issueInput.value.trim();
  const priority = domElements.priorityInput.value;
  const status = domElements.statusInput.value;
  const id = domElements.idInput.value;

  if (!name || !issue) {
    alert("Please fill all required fields.");
    return;
  }

  if (id) {
    tickets = tickets.map((t) =>
      t.id === parseInt(id) ? { ...t, name, issue, priority, status } : t,
    );
  } else {
    const newId =
      tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 1000;
    const newTicket = new Ticket(newId, name, issue, priority, status);
    tickets = [...tickets, newTicket];
  }

  resetForm();
  filterTickets();
};

const editTicket = (idToEdit) => {
  const ticket = tickets.find((t) => t.id === parseInt(idToEdit));
  if (ticket) {
    const { id, name, issue, priority, status } = ticket;
    domElements.idInput.value = id;
    domElements.nameInput.value = name;
    domElements.issueInput.value = issue;
    domElements.priorityInput.value = priority;
    domElements.statusInput.value = status;

    domElements.formTitle.textContent = "Edit Ticket";
    domElements.saveBtn.textContent = "Update Ticket";
  }
};

const deleteTicket = (idToDelete) => {
  if (confirm("Are you sure you want to delete this ticket?")) {
    tickets = tickets.filter((t) => t.id !== parseInt(idToDelete));
    filterTickets();
  }
};

domElements.form.addEventListener("submit", saveTicket);
domElements.resetBtn.addEventListener("click", resetForm);
domElements.searchKeyword.addEventListener("input", filterTickets);
domElements.filterPriority.addEventListener("change", filterTickets);
domElements.filterStatus.addEventListener("change", filterTickets);

renderTickets();
