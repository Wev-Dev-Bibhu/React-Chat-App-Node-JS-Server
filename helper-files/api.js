const api = (res, msg = "", rowData = [], statusCode = 200) => {
  return res
    .status(statusCode)
    .json({ message: msg, data: rowData, status: statusCode == 200 ? "success" : "error" });
}


module.exports = {
  api
};