const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber ? phoneNumber.replace(/\D/g, "") : ""
}
