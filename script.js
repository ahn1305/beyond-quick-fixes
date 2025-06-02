// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Toggle mobile menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Form functionality
  initializeFeedbackForm()
})

function initializeFeedbackForm() {
  const form = document.getElementById("feedbackForm")
  const userTypeRadios = document.querySelectorAll('input[name="userType"]')
  const professionalFields = document.querySelector(".professional-fields")
  const professionalOptions = document.querySelector(".professional-options")
  const forewordCheckbox = document.getElementById("foreword-interest")
  const forewordDetails = document.querySelector(".foreword-details")
  const nextStepBtn = document.querySelector(".next-step")
  const prevStepBtn = document.querySelector(".prev-step")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")

  // Handle user type selection
  userTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "business-professional") {
        professionalFields.style.display = "block"
        professionalOptions.style.display = "block"

        // Make professional fields required
        document.getElementById("company").required = true
        document.getElementById("position").required = true
        document.getElementById("experience").required = true
      } else {
        professionalFields.style.display = "none"
        professionalOptions.style.display = "none"
        forewordDetails.style.display = "none"

        // Remove required from professional fields
        document.getElementById("company").required = false
        document.getElementById("position").required = false
        document.getElementById("experience").required = false
        document.getElementById("foreword-interest").checked = false
      }
    })
  })

  // Handle foreword interest checkbox
  forewordCheckbox.addEventListener("change", function () {
    if (this.checked) {
      forewordDetails.style.display = "block"
      document.getElementById("professional-bio").required = true
      document.getElementById("leadership-philosophy").required = true
    } else {
      forewordDetails.style.display = "none"
      document.getElementById("professional-bio").required = false
      document.getElementById("leadership-philosophy").required = false
    }
  })

  // Handle form steps
  nextStepBtn.addEventListener("click", () => {
    if (validateStep1()) {
      step1.classList.remove("active")
      step2.classList.add("active")

      // Scroll to top of form
      form.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  })

  prevStepBtn.addEventListener("click", () => {
    step2.classList.remove("active")
    step1.classList.add("active")

    // Scroll to top of form
    form.scrollIntoView({ behavior: "smooth", block: "start" })
  })

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (validateStep2()) {
      submitFeedback()
    }
  })

  // Real-time validation
  const inputs = form.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this)
    })

    input.addEventListener("input", function () {
      clearFieldError(this)
    })
  })
}

function validateStep1() {
  const requiredFields = ["userType", "name", "email"]

  const userType = document.querySelector('input[name="userType"]:checked')

  if (userType && userType.value === "business-professional") {
    requiredFields.push("company", "position", "experience")
  }

  let isValid = true

  requiredFields.forEach((fieldName) => {
    const field = document.querySelector(`[name="${fieldName}"]`)
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

function validateStep2() {
  const requiredFields = ["rating", "keyTakeaway"]

  const forewordCheckbox = document.getElementById("foreword-interest")
  if (forewordCheckbox.checked) {
    requiredFields.push("professionalBio", "leadershipPhilosophy")
  }

  let isValid = true

  requiredFields.forEach((fieldName) => {
    const field = document.querySelector(`[name="${fieldName}"]`)
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

function validateField(field) {
  if (!field) return true

  const fieldGroup = field.closest(".form-group")
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  // Clear previous errors
  clearFieldError(field)

  // Check if field is required and empty
  if (field.required && !getFieldValue(field)) {
    isValid = false
    errorMessage = "This field is required."
  }

  // Specific validations
  if (field.type === "email" && field.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(field.value)) {
      isValid = false
      errorMessage = "Please enter a valid email address."
    }
  }

  if (fieldName === "name" && field.value) {
    if (field.value.trim().length < 2) {
      isValid = false
      errorMessage = "Name must be at least 2 characters long."
    }
  }

  if (fieldName === "keyTakeaway" && field.value) {
    if (field.value.trim().length < 10) {
      isValid = false
      errorMessage = "Please provide a more detailed response (at least 10 characters)."
    }
  }

  // Show error if validation failed
  if (!isValid) {
    showFieldError(field, errorMessage)
  }

  return isValid
}

function getFieldValue(field) {
  if (field.type === "radio") {
    const checkedRadio = document.querySelector(`input[name="${field.name}"]:checked`)
    return checkedRadio ? checkedRadio.value : ""
  }
  return field.value.trim()
}

function showFieldError(field, message) {
  const fieldGroup =
    field.closest(".form-group") || field.closest(".radio-group") || field.closest(".user-type-selection")

  if (fieldGroup) {
    fieldGroup.classList.add("error")

    // Remove existing error message
    const existingError = fieldGroup.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Add new error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message
    fieldGroup.appendChild(errorDiv)
  }
}

function clearFieldError(field) {
  const fieldGroup =
    field.closest(".form-group") || field.closest(".radio-group") || field.closest(".user-type-selection")

  if (fieldGroup) {
    fieldGroup.classList.remove("error")
    const errorMessage = fieldGroup.querySelector(".error-message")
    if (errorMessage) {
      errorMessage.remove()
    }
  }
}

function submitFeedback() {
  const form = document.getElementById("feedbackForm")
  const submitBtn = document.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent

  // Show loading state
  submitBtn.disabled = true
  submitBtn.textContent = "Submitting..."

  // Populate hidden fields with structured data
  const userType = document.querySelector('input[name="userType"]:checked')?.value || ""
  const forewordInterest = document.getElementById("foreword-interest")?.checked ? "yes" : "no"

  document.getElementById("hidden-user-type").value = userType
  document.getElementById("hidden-foreword-interest").value = forewordInterest
  document.getElementById("hidden-timestamp").value = new Date().toISOString()

  // Create FormData object and convert to JSON
  const formData = new FormData(form)

  // Add custom message formatting for better email readability
  const customMessage = formatFeedbackMessage(formData)
  formData.set("message", customMessage)

  // Convert FormData to JSON object
  const object = Object.fromEntries(formData)
  const json = JSON.stringify(object)

  // Submit to Web3Forms using JSON
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      const responseJson = await response.json()
      if (response.status == 200) {
        // Show success modal
        showSuccessModal(userType === "business-professional" && forewordInterest === "yes")

        // Reset form
        form.reset()
        document.getElementById("step2").classList.remove("active")
        document.getElementById("step1").classList.add("active")

        // Hide conditional fields
        document.querySelector(".professional-fields").style.display = "none"
        document.querySelector(".professional-options").style.display = "none"
        document.querySelector(".foreword-details").style.display = "none"

        // Clear saved data
        clearSavedData()
      } else {
        console.log(response)
        throw new Error(responseJson.message || "Form submission failed")
      }
    })
    .catch((error) => {
      console.log(error)
      alert(
        "There was an error submitting your feedback. Please try again or contact us directly at ahnashwin1305@gmail.com",
      )
    })
    .finally(() => {
      // Reset button
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    })
}

function formatFeedbackMessage(formData) {
  const userType = formData.get("userType")
  const name = formData.get("name")
  const email = formData.get("email")
  const rating = formData.get("rating")
  const favoriteChapter = formData.get("favoriteChapter")
  const keyTakeaway = formData.get("keyTakeaway")
  const application = formData.get("application")
  const feedbackText = formData.get("feedbackText")
  const recommendation = formData.get("recommendation")

  let message = `NEW BOOK FEEDBACK SUBMISSION\n\n`
  message += `User Type: ${userType === "business-professional" ? "Business Professional" : "General Reader"}\n`
  message += `Name: ${name}\n`
  message += `Email: ${email}\n`
  message += `Overall Rating: ${rating}/5 stars\n\n`

  if (favoriteChapter) {
    message += `Most Impactful Chapter: ${favoriteChapter}\n\n`
  }

  message += `Key Takeaway:\n${keyTakeaway}\n\n`

  if (application) {
    message += `Practical Application:\n${application}\n\n`
  }

  if (feedbackText) {
    message += `Additional Comments:\n${feedbackText}\n\n`
  }

  if (recommendation) {
    message += `Would Recommend: ${recommendation}\n\n`
  }

  // Add professional details if applicable
  if (userType === "business-professional") {
    const company = formData.get("company")
    const position = formData.get("position")
    const experience = formData.get("experience")
    const industry = formData.get("industry")
    const teamSize = formData.get("teamSize")
    const forewordInterest = formData.get("forewordInterest")

    message += `PROFESSIONAL DETAILS:\n`
    message += `Company: ${company}\n`
    message += `Position: ${position}\n`
    message += `Leadership Experience: ${experience}\n`
    message += `Industry: ${industry}\n`
    message += `Team Size: ${teamSize}\n`
    message += `Foreword Interest: ${forewordInterest}\n\n`

    if (forewordInterest === "yes") {
      const professionalBio = formData.get("professionalBio")
      const leadershipPhilosophy = formData.get("leadershipPhilosophy")

      message += `FOREWORD CONSIDERATION DETAILS:\n`
      message += `Professional Bio:\n${professionalBio}\n\n`
      message += `Leadership Philosophy:\n${leadershipPhilosophy}\n\n`
    }
  }

  message += `Submission Time: ${new Date().toLocaleString()}`

  return message
}

function showSuccessModal(showProfessionalMessage = false) {
  const modal = document.getElementById("successModal")
  const professionalMessage = document.getElementById("professionalMessage")

  if (showProfessionalMessage) {
    professionalMessage.style.display = "block"
  } else {
    professionalMessage.style.display = "none"
  }

  modal.style.display = "block"

  // Close modal when clicking the X
  const closeBtn = modal.querySelector(".close")
  closeBtn.onclick = closeModal

  // Close modal when clicking outside
  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal()
    }
  }
}

function closeModal() {
  const modal = document.getElementById("successModal")
  modal.style.display = "none"
}

// Scroll animations
function handleScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(".about-text, .detail-card, .author-text, .feedback-type")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Initialize scroll animations when DOM is loaded
document.addEventListener("DOMContentLoaded", handleScrollAnimations)

// Add some interactive enhancements
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to book cover
  const bookCover = document.querySelector(".book-cover")
  if (bookCover) {
    bookCover.addEventListener("mouseenter", function () {
      this.style.transform = "perspective(1000px) rotateY(-5deg) scale(1.05)"
    })

    bookCover.addEventListener("mouseleave", function () {
      this.style.transform = "perspective(1000px) rotateY(-15deg)"
    })
  }

  // Add typing effect to hero title (optional enhancement)
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const text = heroTitle.textContent
    heroTitle.textContent = ""
    let i = 0

    function typeWriter() {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500)
  }
})

// Form progress indicator
function updateFormProgress() {
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")

  if (step2.classList.contains("active")) {
    // Add progress indicator if needed
    console.log("User is on step 2 of feedback form")
  }
}

// Enhanced form validation with better UX
function enhanceFormValidation() {
  const form = document.getElementById("feedbackForm")

  // Add character counters for textareas
  const textareas = form.querySelectorAll("textarea")
  textareas.forEach((textarea) => {
    const maxLength = textarea.getAttribute("maxlength")
    if (maxLength) {
      const counter = document.createElement("div")
      counter.className = "character-counter"
      counter.style.cssText = "text-align: right; font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;"

      function updateCounter() {
        const remaining = maxLength - textarea.value.length
        counter.textContent = `${textarea.value.length}/${maxLength}`

        if (remaining < 50) {
          counter.style.color = "#ef4444"
        } else {
          counter.style.color = "#6b7280"
        }
      }

      textarea.addEventListener("input", updateCounter)
      textarea.parentNode.appendChild(counter)
      updateCounter()
    }
  })
}

// Initialize enhanced validation when DOM is loaded
document.addEventListener("DOMContentLoaded", enhanceFormValidation)

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Close modal with Escape key
  if (e.key === "Escape") {
    const modal = document.getElementById("successModal")
    if (modal.style.display === "block") {
      closeModal()
    }
  }

  // Navigate form steps with arrow keys (when focused on form)
  if (e.target.closest(".feedback-form")) {
    if (e.key === "ArrowRight" && e.ctrlKey) {
      const nextBtn = document.querySelector(".next-step")
      if (nextBtn && nextBtn.style.display !== "none") {
        nextBtn.click()
      }
    } else if (e.key === "ArrowLeft" && e.ctrlKey) {
      const prevBtn = document.querySelector(".prev-step")
      if (prevBtn && prevBtn.style.display !== "none") {
        prevBtn.click()
      }
    }
  }
})

// Add form auto-save functionality (saves to localStorage)
function initializeAutoSave() {
  const form = document.getElementById("feedbackForm")
  const STORAGE_KEY = "feedback_form_draft"

  // Load saved data
  function loadSavedData() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const data = JSON.parse(savedData)

        Object.keys(data).forEach((key) => {
          const field = form.querySelector(`[name="${key}"]`)
          if (field) {
            if (field.type === "radio") {
              const radioOption = form.querySelector(`[name="${key}"][value="${data[key]}"]`)
              if (radioOption) {
                radioOption.checked = true
                radioOption.dispatchEvent(new Event("change"))
              }
            } else if (field.type === "checkbox") {
              field.checked = data[key] === "yes"
              field.dispatchEvent(new Event("change"))
            } else {
              field.value = data[key]
            }
          }
        })
      }
    } catch (error) {
      console.warn("Could not load saved form data:", error)
    }
  }

  // Save data
  function saveData() {
    try {
      const formData = new FormData(form)
      const data = {}

      for (const [key, value] of formData.entries()) {
        data[key] = value
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn("Could not save form data:", error)
    }
  }

  // Clear saved data
  function clearSavedData() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn("Could not clear saved form data:", error)
    }
  }

  // Auto-save on input
  form.addEventListener("input", debounce(saveData, 1000))
  form.addEventListener("change", saveData)

  // Clear saved data on successful submission
  form.addEventListener("submit", () => {
    setTimeout(clearSavedData, 3000) // Clear after success modal
  })

  // Load saved data on page load
  loadSavedData()
}

// Debounce function for auto-save
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Initialize auto-save when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeAutoSave)

// Add accessibility improvements
function enhanceAccessibility() {
  // Add ARIA labels and descriptions
  const form = document.getElementById("feedbackForm")

  // Add form description
  const formDescription = document.createElement("div")
  formDescription.id = "form-description"
  formDescription.className = "sr-only"
  formDescription.textContent =
    "Multi-step feedback form for Beyond Quick Fixes book. Use Tab to navigate between fields and Enter to submit."
  form.insertBefore(formDescription, form.firstChild)

  form.setAttribute("aria-describedby", "form-description")

  // Add step indicators for screen readers
  const steps = form.querySelectorAll(".form-step")
  steps.forEach((step, index) => {
    step.setAttribute("aria-label", `Step ${index + 1} of ${steps.length}`)
  })

  // Improve radio button accessibility
  const radioGroups = form.querySelectorAll(".user-type-selection")
  radioGroups.forEach((group) => {
    group.setAttribute("role", "radiogroup")
    group.setAttribute("aria-label", "Select your user type")
  })

  // Add live region for form validation messages
  const liveRegion = document.createElement("div")
  liveRegion.id = "form-live-region"
  liveRegion.setAttribute("aria-live", "polite")
  liveRegion.setAttribute("aria-atomic", "true")
  liveRegion.className = "sr-only"
  document.body.appendChild(liveRegion)
}

// Screen reader only styles
const srOnlyStyles = `
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
`

// Add screen reader styles
const styleSheet = document.createElement("style")
styleSheet.textContent = srOnlyStyles
document.head.appendChild(styleSheet)

// Initialize accessibility enhancements
document.addEventListener("DOMContentLoaded", enhanceAccessibility)

// Performance optimization: Lazy load non-critical features
function initializeLazyFeatures() {
  // Intersection Observer for lazy loading animations
  const lazyElements = document.querySelectorAll("[data-lazy]")

  if ("IntersectionObserver" in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target
          element.classList.add("loaded")
          lazyObserver.unobserve(element)
        }
      })
    })

    lazyElements.forEach((element) => {
      lazyObserver.observe(element)
    })
  }
}

// Initialize lazy features
document.addEventListener("DOMContentLoaded", initializeLazyFeatures)

// Add print styles optimization
const printStyles = `
@media print {
    .navbar, .footer, .feedback-form, .modal {
        display: none !important;
    }
    
    .hero, .about, .author {
        page-break-inside: avoid;
    }
    
    .book-cover {
        transform: none !important;
    }
    
    body {
        font-size: 12pt;
        line-height: 1.4;
    }
    
    h1, h2, h3 {
        page-break-after: avoid;
    }
}
`

// Add print styles
const printStyleSheet = document.createElement("style")
printStyleSheet.textContent = printStyles
document.head.appendChild(printStyleSheet)

// Final initialization
console.log("Beyond Quick Fixes website initialized successfully")

// Declare clearSavedData function
function clearSavedData() {
  try {
    localStorage.removeItem("feedback_form_draft")
  } catch (error) {
    console.warn("Could not clear saved form data:", error)
  }
}
