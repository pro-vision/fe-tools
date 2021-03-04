const fs = require("fs");

function getGroupName(groupRows) {
  const groupName = groupRows.filter((groupRow) =>
    groupRow.startsWith("// Group-Name:")
  );
  if (groupName.length === 0) return "Unsorted Colors";

  return groupName[0].split("Group-Name:")[1].trim();
}

function getGroupDescription(groupRows) {
  const groupDescription = groupRows.filter((groupRow) =>
    groupRow.startsWith("// Group-Description:")
  );
  if (groupDescription.length === 0) return false;

  return groupDescription[0].split("Group-Description:")[1].trim();
}

function getColorDefs(groupRows, namespace) {
  const colorDefs = groupRows.filter((groupRow) =>
    groupRow.startsWith(namespace)
  );
  return colorDefs;
}

function getColorInfos(colorDef) {
  const infos = colorDef.split(":");
  return {
    name: infos[0].trim(),
    hex: infos[1].trim(),
  };
}

function getGroupInfos(group, namespace) {
  const groupRows = group.split("\n").filter((row) => row !== "");
  const groupName = getGroupName(groupRows);
  const groupDescription = getGroupDescription(groupRows);
  const colorInfos = getColorDefs(groupRows, namespace).map(getColorInfos);
  return {
    groupName,
    groupDescription,
    colorInfos,
  };
}

module.exports = function (path, namespace, _, opt) {
  const data = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  const groups = data
    .split("// LSG-Color-Group")
    .filter((group) => group !== "");

  const colorData = groups.map((group) => getGroupInfos(group, namespace));

  let results = "";
  colorData.forEach((item) => {
    results += opt.fn(item);
  });
  return results;
};
