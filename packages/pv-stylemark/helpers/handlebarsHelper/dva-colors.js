var fs = require('fs');

module.exports['dva-colors'] = function(ignore, opt) {

  const data = fs.readFileSync(
    'src/styles/base/colors.scss', 
    {
      encoding: 'utf-8'
    }
  );

  const groups = data.split('// LSG-Color-Group').filter(groups => groups !== '');

  const colorData = groups.map(getGroupInfos);

  var results = '';
  colorData.forEach( (item) => {
    results += opt.fn(item);
  });
  return results;
};

function getGroupInfos(group) {
  const groupRows = group.split('\n').filter(row => row !== '');
  const groupName = getGroupName(groupRows);
  const groupDescription = getGroupDescription(groupRows);
  const colorInfos = getColorDefs(groupRows).map(getColorInfos);
  return {
    groupName,
    groupDescription,
    colorInfos
  };
}

function getGroupName(groupRows) {
  let groupName = groupRows.filter((groupRow) => groupRow.startsWith('// Group-Name:'));
  if (groupName.length === 0) return 'Unsorted Colors';

  return groupName[0].split('Group-Name:')[1].trim();
}

function getGroupDescription(groupRows) {
  let groupDescription = groupRows.filter((groupRow) => groupRow.startsWith('// Group-Description:'));
  if (groupDescription.length === 0) return false;

  return groupDescription[0].split('Group-Description:')[1].trim();
}

function getColorDefs(groupRows) {
  let colorDefs = groupRows.filter((groupRow) => groupRow.startsWith('$dva-color'));
  return colorDefs;
}



function getColorInfos(colorDef) {
  const infos = colorDef.split(':');
  return {
    name: infos[0].trim(),
    hex: infos[1].trim()
  }
}