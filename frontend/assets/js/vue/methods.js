const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber ? phoneNumber.replace(/\D/g, "") : ""
}

window.formatPhoneNumber = formatPhoneNumber
