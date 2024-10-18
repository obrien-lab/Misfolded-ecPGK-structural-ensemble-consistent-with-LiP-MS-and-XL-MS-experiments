const protein_color = '#E6E6FA'
const native_contact_color = '#FFA500'
const loop_color = '#FF0000'
const thread_color = '#0000FF'
const cross_color = '#FFFFFF'
const lipms_color = '#00FFFF'
const xlms_color = '#FF00FF'

const align_resid_dict = {'whole': '1-387',
                          'N-ter': '1-164',
                          'C-ter': '165-387',}

var alignSelect_options = []
for (var key in  align_resid_dict) {
  alignSelect_options.push([align_resid_dict[key], key])
}

document.getElementById("loading_div").style.visibility="hidden"

// Create NGL Stage object
var stage = new NGL.Stage( "viewport");

// Handle window resizing
window.addEventListener( "resize", function( event ){
    stage.handleResize();
    update_checkbox_div_height();
}, false );

stage.setParameters({
  backgroundColor: "white",
  cameraType: 'perspective',
  lightIntensity: 1.0,
  ambientIntensity: 0.2,
  fogNear: 50,
  fogFar: 100,
})

function addElement (container, el) {
  Object.assign(el.style, {
    position: "absolute",
    zIndex: 10
  })
  container.appendChild(el)
}

function createElement (name, properties, style) {
  var el = document.createElement(name)
  Object.assign(el, properties)
  Object.assign(el.style, style)
  return el
}

function createSelect (options, properties, style) {
  var select = createElement("select", properties, style)
  options.forEach(function (d) {
    select.add(createElement("option", {
      value: d[ 0 ], text: d[ 1 ]
    }))
  })
  return select
}

function createFileButton (label, properties, style) {
  var input = createElement("input", Object.assign({
    type: "file"
  }, properties), { display: "none" })
  addElement(document.getElementById("cntrl_panel"), input)
  var button = createElement("input", {
    value: label,
    type: "button",
    onclick: function () { input.click() }
  }, style)
  return button
}

function createTable (id_prefix, num_row, num_column, if_head) {
  var table = document.createElement('table');
  table.setAttribute('id', id_prefix+'_table')
  if (if_head) {
    var thead = document.createElement('thead');
    thead.setAttribute('id', id_prefix+'_thead')
    table.appendChild(thead);
    var headRow = document.createElement('tr');
    headRow.setAttribute('id', id_prefix+'_headRow')
    thead.appendChild(headRow);
    for (var i = 0; i < num_column; i++) {
      var headCell = document.createElement('th');
      headCell.textContent = '';
      headCell.setAttribute('id', id_prefix+'_headCell_'+(i))
      headRow.appendChild(headCell);
    }
  }
  var tbody = document.createElement('tbody');
  tbody.setAttribute('id', id_prefix+'_tbody')
  table.appendChild(tbody);
  for (var i = 0; i < num_row; i++) {
    var row = document.createElement('tr');
    row.setAttribute('id', id_prefix+'_row_'+i)
    for (var j = 0; j < num_column; j++) {
      var cell = document.createElement('td');
      cell.textContent = '';
      cell.setAttribute('id', id_prefix+'_cell_'+i+'_'+j);
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  return table
}

function creatHelpIcon(width) {
  const backgroundColor_0 = 'RoyalBlue'
  const backgroundColor_1 = 'white'
  const stroke_color_0 = 'RoyalBlue'
  const stroke_color_1 = 'black'
  const fontColor_0 = 'white'
  const fontColor_1 = 'black'
  var svgns = "http://www.w3.org/2000/svg";
  var icon = document.createElementNS(svgns, "svg")
  icon.setAttribute('width', width)
  icon.setAttribute('height', width)
  icon.setAttribute('viewBox', "0 0 50 50")
  var circle = document.createElementNS(svgns, "circle")
  circle.setAttribute('cx', 25)
  circle.setAttribute('cy', 25)
  circle.setAttribute('r', 23)
  Object.assign(circle.style, {
    'fill': backgroundColor_0,
    'stroke': stroke_color_0,
    'stroke-width': 2,
  })
  icon.appendChild(circle)
  var text = document.createElementNS(svgns, "text")
  text.setAttribute('x', "50%")
  text.setAttribute('y', "50%")
  Object.assign(text.style, {
    'fill': fontColor_0,
    'font-size': 45,
    'font-family': 'Arial',
    'text-anchor': 'middle',
    'dominant-baseline': 'central',
  })
  text.innerHTML = "?"
  icon.appendChild(text)

  icon.addEventListener('mouseover', (e) => {
    e.target.style.cursor = 'pointer'
    e.target.parentElement.getElementsByTagName('circle')[0].style.fill = backgroundColor_1
    e.target.parentElement.getElementsByTagName('circle')[0].style.stroke = stroke_color_1
    e.target.parentElement.getElementsByTagName('text')[0].style.fill = fontColor_1
  })
  icon.addEventListener('mouseout', (e) => {
    e.target.style.cursor = 'pointer'
    e.target.parentElement.getElementsByTagName('circle')[0].style.fill = backgroundColor_0
    e.target.parentElement.getElementsByTagName('circle')[0].style.stroke = stroke_color_0
    e.target.parentElement.getElementsByTagName('text')[0].style.fill = fontColor_0
  })
  return icon
}

function creatSettingIcon(width) {
  const svgns = "http://www.w3.org/2000/svg";
  const path_fill_color_0 = 'RoyalBlue'
  const path_fill_color_1 = 'DarkBlue'
  const path_stroke_color_0 = 'RoyalBlue'
  const path_stroke_color_1 = 'DarkBlue'

  var icon = document.createElementNS(svgns, "svg")
  icon.setAttribute('height', width)
  icon.setAttribute('viewBox', "0 0 512 512")
  var title = document.createElementNS(svgns, "title")
  title.innerHTML = "Scene preference settings"
  icon.appendChild(title)

  var path = document.createElementNS(svgns, "path")
  path.setAttribute("d", "M 495.9 166.6 "+
                         "c 3.2 8.7 .5 18.4 -6.4 24.6 "+
                         "l -43.3 39.4 "+
                         "c 1.1 8.3 1.7 16.8 1.7 25.4 "+
                         "s -.6 17.1 -1.7 25.4 "+
                         "l 43.3 39.4 "+
                         "c 6.9 6.2 9.6 15.9 6.4 24.6 "+
                         "c -4.4 11.9 -9.7 23.3 -15.8 34.3 "+
                         "l -4.7 8.1 "+
                         "c -6.6 11 -14 21.4 -22.1 31.2 "+
                         "c -5.9 7.2 -15.7 9.6 -24.5 6.8 "+
                         "l -55.7 -17.7 "+
                         "c -13.4 10.3 -28.2 18.9 -44 25.4 "+
                         "l -12.5 57.1 "+
                         "c -2 9.1 -9 16.3 -18.2 17.8 "+
                         "c -13.8 2.3 -28 3.5 -42.5 3.5 "+
                         "s -28.7 -1.2 -42.5 -3.5 "+
                         "c -9.2 -1.5 -16.2 -8.7 -18.2 -17.8 "+
                         "l -12.5 -57.1 "+
                         "c -15.8 -6.5 -30.6 -15.1 -44 -25.4 "+
                         "L 83.1 425.9 "+
                         "c -8.8 2.8 -18.6 .3 -24.5 -6.8 "+
                         "c -8.1 -9.8 -15.5 -20.2 -22.1 -31.2 "+
                         "l -4.7 -8.1 "+
                         "c -6.1 -11 -11.4 -22.4 -15.8 -34.3 "+
                         "c -3.2 -8.7 -.5 -18.4 6.4 -24.6 "+
                         "l 43.3 -39.4 "+
                         "C 64.6 273.1 64 264.6 64 256 "+
                         "s .6 -17.1 1.7 -25.4 "+
                         "L 22.4 191.2 "+
                         "c -6.9 -6.2 -9.6 -15.9 -6.4 -24.6 "+
                         "c 4.4 -11.9 9.7 -23.3 15.8 -34.3 "+
                         "l 4.7 -8.1 "+
                         "c 6.6 -11 14 -21.4 22.1 -31.2 "+
                         "c 5.9 -7.2 15.7 -9.6 24.5 -6.8 "+
                         "l 55.7 17.7 "+
                         "c 13.4 -10.3 28.2 -18.9 44 -25.4 "+
                         "l 12.5 -57.1 "+
                         "c 2 -9.1 9 -16.3 18.2 -17.8 "+
                         "C 227.3 1.2 241.5 0 256 0 "+
                         "s 28.7 1.2 42.5 3.5 "+
                         "c 9.2 1.5 16.2 8.7 18.2 17.8 "+
                         "l 12.5 57.1 "+
                         "c 15.8 6.5 30.6 15.1 44 25.4 "+
                         "l 55.7 -17.7 "+
                         "c 8.8 -2.8 18.6 -.3 24.5 6.8 "+
                         "c 8.1 9.8 15.5 20.2 22.1 31.2 "+
                         "l 4.7 8.1 "+
                         "c 6.1 11 11.4 22.4 15.8 34.3 z "+
                         "M 256 336 "+
                         "a 80 80 0 1 0 0 -160 80 80 0 1 0 0 160 z")
  Object.assign(path.style, {
    'fill': path_fill_color_0,
    'stroke': path_stroke_color_0,
    'stroke-width': 0,
  })
  icon.appendChild(path)

  icon.addEventListener('mouseover', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_1
      path_list[i].style.stroke = path_stroke_color_1
    }
  })
  icon.addEventListener('mouseout', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_0
      path_list[i].style.stroke = path_stroke_color_0
    }
  })
  return icon
}

function creatCenterIcon(width) {
  const svgns = "http://www.w3.org/2000/svg";
  const path_fill_color_0 = 'RoyalBlue'
  const path_fill_color_1 = 'DarkBlue'
  const path_stroke_color_0 = 'RoyalBlue'
  const path_stroke_color_1 = 'DarkBlue'

  var icon = document.createElementNS(svgns, "svg")
  icon.setAttribute('height', width)
  icon.setAttribute('viewBox', "0 0 640 512")
  var title = document.createElementNS(svgns, "title")
  title.innerHTML = "Center this molecule in the scene"
  icon.appendChild(title)

  var path = document.createElementNS(svgns, "path")
  path.setAttribute("d", "M15 15 "+
                         "C 24.4 5.7 39.6 5.7 49 15 "+
                         "l 63 63 "+
                         "V 40 "+
                         "c 0 -13.3 10.7 -24 24 -24 "+
                         "s 24 10.7 24 24 "+
                         " v 96 "+
                         "c 0 13.3 -10.7 24 -24 24 "+
                         "H 40 "+
                         "c -13.3 0 -24 -10.7 -24 -24 "+
                         "s 10.7 -24 24 -24 "+
                         "H 78.1 "+
                         "L 15 49 "+
                         "C 5.7 39.6 5.7 24.4 15 15 z "+
                         "M 133.5 243.9 "+
                         "C 158.6 193.6 222.7 112 320 112 "+
                         "s 161.4 81.6 186.5 131.9 "+
                         "c 3.8 7.6 3.8 16.5 0 24.2 "+
                         "C 481.4 318.4 417.3 400 320 400 "+
                         "s -161.4 -81.6 -186.5 -131.9 "+
                         "c -3.8 -7.6 -3.8 -16.5 0 -24.2 z "+
                         "M 320 320 "+
                         "a 64 64 0 1 0 0 -128 64 64 0 1 0 0 128 z "+
                         "M 591 15 "+
                         "c 9.4 -9.4 24.6 -9.4 33.9 0 "+
                         "s 9.4 24.6 0 33.9 "+
                         "l -63 63 "+
                         "H 600 "+
                         "c 13.3 0 24 10.7 24 24 "+
                         "s -10.7 24 -24 24 "+
                         "H 504 "+
                         "c -13.3 0 -24 -10.7 -24 -24 "+
                         "V 40 "+
                         "c0 -13.3 10.7 -24 24 -24 "+
                         "s 24 10.7 24 24 "+
                         "V 78.1 "+
                         "l 63 -63 z "+
                         "M 15 497 "+
                         "c -9.4 -9.4 -9.4 -24.6 0 -33.9 "+
                         "l 63 -63 "+
                         "H 40 "+
                         "c -13.3 0 -24 -10.7 -24 -24 "+
                         "s 10.7 -24 24 -24 "+
                         "h 96 "+
                         "c 13.3 0 24 10.7 24 24 "+
                         "v 96 "+
                         "c 0 13.3 -10.7 24 -24 24 "+
                         "s -24 -10.7 -24 -24 "+
                         "V 433.9 "+
                         "L 49 497 "+
                         "c -9.4 9.4 -24.6 9.4 -33.9 0 z "+
                         "m 576 0 "+
                         "l -63 -63 "+
                         "V 472 "+
                         "c 0 13.3 -10.7 24 -24 24 "+
                         "s -24 -10.7 -24 -24 "+
                         "V 376 "+
                         "c 0 -13.3 10.7 -24 24 -24 "+
                         "h 96 "+
                         "c 13.3 0 24 10.7 24 24 "+
                         "s -10.7 24 -24 24 "+
                         "H 561.9 "+
                         "l 63 63 "+
                         "c 9.4 9.4 9.4 24.6 0 33.9 "+
                         "s -24.6 9.4 -33.9 0 z")
  Object.assign(path.style, {
    'fill': path_fill_color_0,
    'stroke': path_stroke_color_0,
    'stroke-width': 0,
  })
  icon.appendChild(path)

  icon.addEventListener('mouseover', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_1
      path_list[i].style.stroke = path_stroke_color_1
    }
  })
  icon.addEventListener('mouseout', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_0
      path_list[i].style.stroke = path_stroke_color_0
    }
  })
  return icon
}

function creatExportIcon(width) {
  const svgns = "http://www.w3.org/2000/svg";
  const path_fill_color_0 = 'RoyalBlue'
  const path_fill_color_1 = 'DarkBlue'
  const path_stroke_color_0 = 'RoyalBlue'
  const path_stroke_color_1 = 'DarkBlue'

  var icon = document.createElementNS(svgns, "svg")
  icon.setAttribute('height', width)
  icon.setAttribute('viewBox', "0 0 512 512")
  var title = document.createElementNS(svgns, "title")
  title.innerHTML = "Export a PNG image and download"
  icon.appendChild(title)

  var path = document.createElementNS(svgns, "path")
  path.setAttribute("d", "M 149.1 64.8 "+
                         "L 138.7 96 "+
                         "H 64 "+
                         "C 28.7 96 0 124.7 0 160 "+
                         "V 416 "+
                         "c 0 35.3 28.7 64 64 64 "+
                         "H 448 "+
                         "c 35.3 0 64 -28.7 64 -64 "+
                         "V 160 "+
                         "c 0 -35.3 -28.7 -64 -64 -64 "+
                         "H 373.3 "+
                         "L 362.9 64.8 "+
                         "C 356.4 45.2 338.1 32 317.4 32 "+
                         "H 194.6 "+
                         "c -20.7 0 -39 13.2 -45.5 32.8 z "+
                         "M 256 192 "+
                         "a 96 96 0 1 1 0 192 96 96 0 1 1 0 -192 z")
  Object.assign(path.style, {
    'fill': path_fill_color_0,
    'stroke': path_stroke_color_0,
    'stroke-width': 0,
  })
  icon.appendChild(path)

  icon.addEventListener('mouseover', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_1
      path_list[i].style.stroke = path_stroke_color_1
    }
  })
  icon.addEventListener('mouseout', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_0
      path_list[i].style.stroke = path_stroke_color_0
    }
  })
  return icon
}

function creatDownloadIcon(width) {
  const svgns = "http://www.w3.org/2000/svg";
  const path_fill_color_0 = 'RoyalBlue'
  const path_fill_color_1 = 'DarkBlue'
  const path_stroke_color_0 = 'RoyalBlue'
  const path_stroke_color_1 = 'DarkBlue'

  var icon = document.createElementNS(svgns, "svg")
  icon.setAttribute('height', width)
  icon.setAttribute('viewBox', "0 0 512 512")
  var title = document.createElementNS(svgns, "title")
  title.innerHTML = "Download the PDB file of the misfolded structure"
  icon.appendChild(title)

  var path = document.createElementNS(svgns, "path")
  path.setAttribute("d", "M 288 32 "+
                         "c 0 -17.7 -14.3 -32 -32 -32 "+
                         "s -32 14.3 -32 32 "+
                         "V 274.7 "+
                         "l -73.4 -73.4 "+
                         "c -12.5 -12.5 -32.8 -12.5 -45.3 0 "+
                         "s -12.5 32.8 0 45.3 "+
                         "l 128 128 "+
                         "c 12.5 12.5 32.8 12.5 45.3 0 "+
                         "l 128 -128 "+
                         "c 12.5 -12.5 12.5 -32.8 0 -45.3 "+
                         "s -32.8 -12.5 -45.3 0 "+
                         "L 288 274.7 "+
                         "V 32 z "+
                         "M 64 352 "+
                         "c -35.3 0 -64 28.7 -64 64 "+
                         "v 32 "+
                         "c 0 35.3 28.7 64 64 64 "+
                         "H 448 "+
                         "c 35.3 0 64 -28.7 64 -64 "+
                         "V 416 "+
                         "c 0 -35.3 -28.7 -64 -64 -64 "+
                         "H 346.5 "+
                         "l -45.3 45.3 "+
                         "c -25 25 -65.5 25 -90.5 0 "+
                         "L 165.5 352 "+
                         "H 64 z "+
                         "m 368 56 "+
                         "a 24 24 0 1 1 0 48 24 24 0 1 1 0 -48 z")
  Object.assign(path.style, {
    'fill': path_fill_color_0,
    'stroke': path_stroke_color_0,
    'stroke-width': 0,
  })
  icon.appendChild(path)

  icon.addEventListener('mouseover', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_1
      path_list[i].style.stroke = path_stroke_color_1
    }
  })
  icon.addEventListener('mouseout', (e) => {
    e.target.style.cursor = 'pointer'
    var parent = e.target.parentElement
    var path_list = parent.getElementsByTagName('path')
    for (var i = 0; i < path_list.length; i++) {
      path_list[i].style.fill = path_fill_color_0
      path_list[i].style.stroke = path_stroke_color_0
    }
  })
  return icon
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function hexToRgb(hex) {
  let x = [];
  hex = hex.replace('#', '')
  x.push(parseInt(hex.slice(0, 2), 16) / 255)
  x.push(parseInt(hex.slice(2, 4), 16) / 255)
  x.push(parseInt(hex.slice(4, 6), 16) / 255)
  return x
}

// recenter the structure in the scene
function reset_view() {
  var new_box = null
  for (i in struct) {
    var sele = []
    for (j in struct[i].reprList) {
      var repr = struct[i].reprList[j]
      if (! repr.parameters.name.includes(' surface')) {
        if (repr.parameters.visible) {
          sele = sele.concat(repr.repr.selection.string.substr(1).split(','))
        }
      }
    }
    if (sele.length > 0) {
      var sele_str = '@'+([...new Set(sele)].join(','))
      var box = struct[i].structure.getBoundingBox(new NGL.Selection(sele_str))
      if (new_box == null) {
        new_box = box
      }
      else {
        new_box = new_box.union(box)
      }
    }
  }

  if (new_box != null) {
    var new_box_center = new NGL.Vector3()
    new_box.getCenter(new_box_center)
    stage.animationControls.zoomMove(
      new_box_center,
      stage.getZoomForBox(new_box),
      1000
    )
  }
}

// load structure and show entanglements
var struct = null
var struct_info_dict = null
var native_M = null

function loadStructure (arg_str) {
  fetch(arg_str+'/ngl_viz.json', {cache: "no-cache"})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(struct_info => {
    // Handle the JSON data
    struct_info_dict = struct_info
    _loadStructure(struct_info)
    addFunToCheckbox(struct_info)
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
  });
}

// Align two structures and transform components
function _align_structures(ref_struct, target_struct, ref_sel, target_sel) {
  // Transformation matrix
  var atoms1 = ref_struct.structureView.getView(new NGL.Selection(ref_sel+' and .CA'))
  var atoms2 = target_struct.structureView.getView(new NGL.Selection(target_sel+' and .CA'))
  var superpose = new NGL.Superposition(atoms2, atoms1)
  var trans_M = superpose.transformationMatrix
  
  var Comp_list = stage.getComponentsByName(/misfolded native contact #[0-9]+/).list
  for (var i = 0; i < Comp_list.length; i++) {
    var new_trans_M = Comp_list[i].transform
    new_trans_M.premultiply(trans_M)
    Comp_list[i].setTransform(new_trans_M)
  }

  var Comp_list = stage.getComponentsByName(/misfolded jwalk .+/).list
  for (var i = 0; i < Comp_list.length; i++) {
    var new_trans_M = Comp_list[i].transform
    new_trans_M.premultiply(trans_M)
    Comp_list[i].setTransform(new_trans_M)
  }
  
  target_struct.superpose(ref_struct, false, ref_sel, target_sel)

}

// Load structures and create representations
function _loadStructure(json_obj) {
  stage.removeAllComponents();

  var chain_sel = ":"+json_obj.chain
  var exp_signal_list = json_obj.exp_signal_list
  var chg_ent_struct_state = json_obj.chg_ent_struct_state
  var exp_signal_M_dict = json_obj.exp_signal_M_dict
  var chg_ent_dict = json_obj.chg_ent_dict
  var selection_dict = json_obj.selection_dict
  // console.log(json_obj)

  document.getElementById("info").innerHTML = "Loading structures... (if no response for a long time, please refresh this page)"

  var checkbox_div = document.getElementById('checkbox_div')
  // remove previous checkbox
  checkbox_div.innerHTML = ""
  // set checkbox
  var proteinCheckField = createElement("fieldset", {
    id: "proteinCheckField",
  }, { "margin-top": "2%",
       "margin-bottom": "2%",})
  checkbox_div.appendChild(proteinCheckField)
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('proteinCheckHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  var legend = createElement("legend", {
    innerHTML: "<b>Proteins:</b> ",
  }, { "text-align": "left",
       "font-family": "Arial", 
       "font-size": "1.4vmin",})
  legend.appendChild(help_icon)
  proteinCheckField.appendChild(legend)
  var proteinTable = createTable('proteinTable', 1, Object.keys(selection_dict).length, false)
  proteinCheckField.appendChild(proteinTable)
  Object.assign(proteinTable.style, { 
    width: "100%",
    "text-align": "left",
  })
  for (var i = 0; i < Object.keys(selection_dict).length; i++) {
    var cell = document.getElementById('proteinTable_cell_0_'+i)
    var proteinCheckbox = createElement("input", {
      type: "checkbox",
      id: Object.keys(selection_dict)[i] + "Checkbox",
      onmouseover: function () {
        this.style.cursor = 'pointer'
      }
    }, { width: "1.4vmin",
         height: "1.4vmin",
         "vertical-align": "middle",})
    cell.appendChild(proteinCheckbox)
    var label = createElement("label", {
      innerText: capitalizeFirstLetter(Object.keys(selection_dict)[i]),
      onmouseover: function () {
        this.style.cursor = 'pointer'
      }
      }, { "font-family": "Arial", 
           "font-size": "1.4vmin",
           "vertical-align": "middle", })
    label.setAttribute("for", proteinCheckbox.id)
    cell.appendChild(label)
  }

  // Entanglement check box
  var entCheckField = createElement("fieldset", {
    id: "entCheckField",
  }, { "margin-top": "2%",
       "margin-bottom": "2%",})
  checkbox_div.appendChild(entCheckField)
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('entCheckHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  var legend = createElement("legend", {
    innerHTML: "<b>Changes in Entanglements:</b> "
  }, { "text-align": "left",
       "font-family": "Arial", 
       "font-size": "1.4vmin",})
  legend.appendChild(help_icon)
  entCheckField.appendChild(legend)

  var entTable = createTable('entTable', chg_ent_struct_state.length, 1+Object.keys(selection_dict).length, false)
  entCheckField.appendChild(entTable)
  Object.assign(entTable.style, { 
    width: "100%",
    "text-align": "left",
  })
  for (var i = 0; i < chg_ent_struct_state.length; i++) {
    var cell = document.getElementById('entTable_cell_'+i+'_0')
    cell.appendChild(createElement("span", {
      innerHTML: "&bull; "+(chg_ent_struct_state[i]) + " (" + (chg_ent_dict[chg_ent_struct_state[i]].code) + "):"
    }, { "font-family": "Arial", 
         "font-size": "1.4vmin"}))
    for (var j = 0; j < Object.keys(selection_dict).length; j++) {
      var cell = document.getElementById('entTable_cell_'+i+'_'+(j+1))
      var entanglementCheckbox = createElement("input", {
        type: "checkbox",
        id: Object.keys(selection_dict)[j]+"EntCheckbox #"+(i+1),
        onmouseover: function () {
          this.style.cursor = 'pointer'
        }
      }, { width: "1.4vmin",
           height: "1.4vmin",
           "vertical-align": "middle", })
      cell.appendChild(entanglementCheckbox)
      var label = createElement("label", {
        innerText: Object.keys(selection_dict)[j][0].toUpperCase(),
        onmouseover: function () {
          this.style.cursor = 'pointer'
        }
        }, { "font-family": "Arial", 
             "font-size": "1.4vmin",
             "vertical-align": "middle", })
      label.setAttribute("for", entanglementCheckbox.id)
      cell.appendChild(label)
    }
  }

  // Experimental signal check box
  // LiPMS
  var lipmsCheckField = createElement("fieldset", {
    id: "lipmsCheckField",
  }, { "margin-top": "2%",
       "margin-bottom": "2%",})
  checkbox_div.appendChild(lipmsCheckField)
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('lipmsCheckHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  var legend = createElement("legend", {
    innerHTML: "<b>LiP-MS cut-sites:</b> ",
  }, { "text-align": "left",
       "font-family": "Arial", 
       "font-size": "1.4vmin",})
  legend.appendChild(help_icon)
  lipmsCheckField.appendChild(legend)
  var lipmsTable = createTable('lipmsTable', Object.keys(selection_dict['misfolded']['lipms']).length, 1+Object.keys(selection_dict).length, false)
  lipmsCheckField.appendChild(lipmsTable)
  Object.assign(lipmsTable.style, { 
    width: "100%",
    "text-align": "left",
  })
  for (var i = 0; i < Object.keys(selection_dict['misfolded']['lipms']).length; i++) {
    var signal_name = Object.keys(selection_dict['misfolded']['lipms'])[i]
    var cell = document.getElementById('lipmsTable_cell_'+i+'_0')
    cell.appendChild(createElement("span", {
      innerHTML: "&bull; "+signal_name + ":",
      id: "expLabel #"+(exp_signal_list.indexOf(signal_name)+1)
    }, { "font-family": "Arial", 
         "font-size": "1.4vmin"}))
    for (var j = 0; j < Object.keys(selection_dict).length; j++) {
      var cell = document.getElementById('lipmsTable_cell_'+i+'_'+(j+1))
      var experimentCheckbox = createElement("input", {
        type: "checkbox",
        id: Object.keys(selection_dict)[j]+"ExpCheckbox #"+(exp_signal_list.indexOf(signal_name)+1),
        onmouseover: function () {
          this.style.cursor = 'pointer'
        }
      }, { width: "1.4vmin",
           height: "1.4vmin",
           "vertical-align": "middle", })
      cell.appendChild(experimentCheckbox)
      var label = createElement("label", {
        innerText: Object.keys(selection_dict)[j][0].toUpperCase(),
        onmouseover: function () {
          this.style.cursor = 'pointer'
        }
        }, { "font-family": "Arial", 
             "font-size": "1.4vmin",
             "vertical-align": "middle", })
      label.setAttribute("for", experimentCheckbox.id)
      cell.appendChild(label)
    }
  }
  // XLMS
  var xlmsCheckField = createElement("fieldset", {
    id: "xlmsCheckField",
  }, { "margin-top": "2%",
       "margin-bottom": "2%",})
  checkbox_div.appendChild(xlmsCheckField)
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('xlmsCheckHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  var legend = createElement("legend", {
    innerHTML: "<b>XL-MS pairs:</b> ",
  }, { "text-align": "left",
       "font-family": "Arial", 
       "font-size": "1.4vmin",})
  legend.appendChild(help_icon)
  xlmsCheckField.appendChild(legend)
  var xlmsTable = createTable('xlmsTable', Object.keys(selection_dict['misfolded']['xlms']).length, 1+Object.keys(selection_dict).length, false)
  xlmsCheckField.appendChild(xlmsTable)
  Object.assign(xlmsTable.style, { 
    width: "100%",
    "text-align": "left",
  })
  for (var i = 0; i < Object.keys(selection_dict['misfolded']['xlms']).length; i++) {
    var signal_name = Object.keys(selection_dict['misfolded']['xlms'])[i]
    var cell = document.getElementById('xlmsTable_cell_'+i+'_0')
    cell.appendChild(createElement("span", {
      innerHTML: "&bull; "+signal_name + ":",
      id: "expLabel #"+(exp_signal_list.indexOf(signal_name)+1)
    }, { "font-family": "Arial", 
         "font-size": "1.4vmin"}))
    for (var j = 0; j < Object.keys(selection_dict).length; j++) {
      var cell = document.getElementById('xlmsTable_cell_'+i+'_'+(j+1))
      var experimentCheckbox = createElement("input", {
        type: "checkbox",
        id: Object.keys(selection_dict)[j]+"ExpCheckbox #"+(exp_signal_list.indexOf(signal_name)+1),
        onmouseover: function () {
          this.style.cursor = 'pointer'
        }
      }, { width: "1.4vmin",
           height: "1.4vmin",
           "vertical-align": "middle", })
      cell.appendChild(experimentCheckbox)
      var label = createElement("label", {
        innerText: Object.keys(selection_dict)[j][0].toUpperCase(),
        onmouseover: function () {
          this.style.cursor = 'pointer'
        }
        }, { "font-family": "Arial", 
             "font-size": "1.4vmin",
             "vertical-align": "middle", })
      label.setAttribute("for", experimentCheckbox.id)
      cell.appendChild(label)
    }
  }

  // load structures
  Promise.all(Array.from({length: Object.keys(selection_dict).length}, (_, struct_id) => 
    stage.loadFile(selection_dict[Object.keys(selection_dict)[struct_id]]['path'], {ext: 'pdb', sele: chain_sel}).then(function (o) {
      struct_key = Object.keys(selection_dict)[struct_id]
      o.autoView()
      var if_vis = false
      var colorScheme_list = [[protein_color, "*"]]
      if (struct_key == 'misfolded') {
        if_vis = true
        var sel_ent_dict = selection_dict[struct_key]['chg_ent'][chg_ent_struct_state[0]]
        colorScheme_list = [[loop_color, sel_ent_dict['loop']],
                            [thread_color, sel_ent_dict['thread']]].concat(colorScheme_list)
      }
      var schemeId = NGL.ColormakerRegistry.addSelectionScheme(colorScheme_list, struct_key+"_colorScheme");
      r = o.addRepresentation('cartoon', {
        sele: selection_dict[struct_key]['sel'],
        color: schemeId,
        smoothSheet: true,
        aspectRatio: 3.5,
        radiusScale: 1.5,
        quality: 'high',
        name: struct_key+" protein"
      })
      r.setVisibility(if_vis)
      // show entanglements
      for (i = 0; i < chg_ent_struct_state.length; i++) {
        if_vis = false
        if (i == 0 & struct_key == 'misfolded') {
          if_vis = true
        }
        var sel_ent_dict = selection_dict[struct_key]['chg_ent'][chg_ent_struct_state[i]]
        if (sel_ent_dict['cross'] != '') {
          r = o.addRepresentation('spacefill', {
            sele: sel_ent_dict['cross'],
            color: cross_color,
            name: struct_key+" crossing atoms #"+(i+1)
          })
          r.setVisibility(if_vis)
        }
        r = o.addRepresentation('spacefill', {
          sele: sel_ent_dict['native_contact'],
          color: native_contact_color,
          name: struct_key+" NC atoms #"+(i+1)
        })
        r.setVisibility(if_vis)
      }
      // show experimental signals
      for (var i = 0; i < exp_signal_list.length; i++) {
        var if_vis = false
        var signal_name = exp_signal_list[i]
        if (!signal_name.includes('-')) {
          // LiP-MS signal
          var singal_info = selection_dict[struct_key]['lipms'][signal_name]
          r = o.addRepresentation('spacefill', {
            sele: singal_info['site_sel'],
            color: lipms_color,
            name: struct_key+" LiP-MS cut-site "+signal_name
          })
          r.setVisibility(if_vis)
        }
        else {
          // XL-MS signal
          var singal_info = selection_dict[struct_key]['xlms'][signal_name]
          r = o.addRepresentation('spacefill', {
            sele: singal_info['site_sel'],
            color: xlms_color,
            name: struct_key+" XL-MS site "+signal_name
          })
          r.setVisibility(if_vis)
          // load jwalk distance
          var jwalk_cor = singal_info['jwalk_cor']
          var shape = new NGL.Shape(struct_key+" jwalk "+signal_name, { dashedCylinder: false, radialSegments: 60 })
          for(var j = 0; j < jwalk_cor.length-1; j++) {
            shape.addCylinder(jwalk_cor[j], jwalk_cor[j+1], hexToRgb(xlms_color), 0.4, struct_key+" jwalk "+signal_name)
            shape.addSphere(jwalk_cor[j], hexToRgb(xlms_color), 0.4, struct_key+" jwalk "+signal_name)
          }
          // shape.addSphere(jwalk_cor[jwalk_cor.length-1], hexToRgb(xlms_color), 0.4, struct_key+" jwalk "+signal_name)
          var shapeComp = stage.addComponentFromObject(shape)
          r = shapeComp.addRepresentation("buffer", {name: struct_key+" jwalk "+signal_name})
          r.setVisibility(if_vis)
        }
      }

      return o
    })
  )).then(function (ol) {
    // Add native contacts
    for (struct_id = 0; struct_id < ol.length; struct_id++) {
      struct_key = Object.keys(selection_dict)[struct_id]
      // add native contacts
      const dash_length = 0.6
      const dash_space = 0.4
      for (i = 0; i < chg_ent_struct_state.length; i++) {
        var if_vis = false
        if (i == 0 & struct_key == 'misfolded') {
          if_vis = true
        }
        var sel_ent_dict = selection_dict[struct_key]['chg_ent'][chg_ent_struct_state[i]]
        var nc_cor = []
        var sel = sel_ent_dict['native_contact']
        ol[struct_id].structure.eachAtom(function (ap) {
          nc_cor.push([ap.x, ap.y, ap.z])
        }, new NGL.Selection(sel))
        var shape = new NGL.Shape(struct_key+" native contact #"+(i+1), { openEnded: false, dashedCylinder: false, radialSegments: 60 })
        var direction = [ nc_cor[1][0] - nc_cor[0][0], 
                          nc_cor[1][1] - nc_cor[0][1], 
                          nc_cor[1][2] - nc_cor[0][2] ]
        var nc_length = (direction[0]**2 + direction[1]**2 + direction[2]**2)**0.5
        var norm_dir = [ direction[0]/nc_length, direction[1]/nc_length, direction[2]/nc_length ]
        var num_dash = Math.floor(nc_length / (dash_length+dash_space))
        for(var j = 0; j < num_dash; j++) {
          var dir = [ norm_dir[0]*(dash_length+dash_space)*j, 
                      norm_dir[1]*(dash_length+dash_space)*j,
                      norm_dir[2]*(dash_length+dash_space)*j ]
          var ps = [ nc_cor[0][0]+dir[0],
                     nc_cor[0][1]+dir[1],
                     nc_cor[0][2]+dir[2] ]
          var pe = [ ps[0]+norm_dir[0]*dash_length,
                     ps[1]+norm_dir[1]*dash_length,
                     ps[2]+norm_dir[2]*dash_length ]
          shape.addCylinder(ps, pe, hexToRgb(native_contact_color), 0.4, struct_key+" native contact #" + (i+1))
        }
        var shapeComp = stage.addComponentFromObject(shape)
        r = shapeComp.addRepresentation("buffer", {name: struct_key+" native contact #"+(i+1)})
        r.setVisibility(if_vis)
      }
    }

    struct = ol

    // Align structures
    var sele_list = []
    for (var i = 0; i < struct.length; i++) {
      var s = struct[i]
      var sel_1 = selection_dict[Object.keys(selection_dict)[i]]['align_sel']
      var sel_2 = document.getElementById('alignSelect').value
      var sele_1 = []
      var sele_2 = []
      var sele = []
      s.structure.eachAtom(function (ap) {
        sele_1.push(ap.index.toString())
      }, new NGL.Selection(sel_1+' and .CA'))
      s.structure.eachAtom(function (ap) {
        var idx = ap.index.toString()
        sele_2.push(idx)
        if (sele_1.indexOf(idx) != -1) {
          sele.push(idx)
        }
      }, new NGL.Selection(sel_2+' and .CA'))
      // If the intersection is too small 
      // (less than half of the original set), 
      // not use the intersection set
      if (sele.length / sele_2.length < 0.5) {
        sele = sele_2
      }
      sele = '@'+sele.join(',')
      sele_list.push(sele)
    }
    for (var i = 1; i < struct.length; i++) {
      _align_structures(struct[0], struct[i], sele_list[0], sele_list[i])
    }

    reset_view()

    if (native_M == null) {
      fetch('./native_M.json', {cache: "no-cache"})
        .then(response => response.json())
        .then(data => {
          native_M = data
          update_info_panel(native_M)
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    else {
      update_info_panel(native_M)
    }
    
  })
}

// Add functions to checkbox
function addFunToCheckbox(struct_info_dict) {
  var exp_signal_list = struct_info_dict.exp_signal_list
  var chg_ent_struct_state = struct_info_dict.chg_ent_struct_state
  var exp_signal_M_dict = struct_info_dict.exp_signal_M_dict
  var chg_ent_dict = struct_info_dict.chg_ent_dict
  var selection_dict = struct_info_dict.selection_dict

  // Protein checkbox
  for (var i = 0; i < Object.keys(selection_dict).length; i++) {
    var name_prefix = Object.keys(selection_dict)[i]
    var proteinCheckbox = document.getElementById(name_prefix+"Checkbox")
    if (name_prefix == 'misfolded') {
      proteinCheckbox.checked = true
    }
    proteinCheckbox.addEventListener('change', (e) => {
      protEntCheckBox_change_function(e)
    })
  }

  for (name_prefix in selection_dict) {
    // Entanglement Checkboxes
    for (i = 0; i < chg_ent_struct_state.length; i++) {
      var if_checked = false
      if (i == 0 & name_prefix == 'misfolded') {
        if_checked = true
      }
      var entanglementCheckbox = document.getElementById(name_prefix+"EntCheckbox #"+(i+1))
      entanglementCheckbox.checked = if_checked
      entanglementCheckbox.addEventListener('change', (e) => {
        protEntCheckBox_change_function(e)
        update_info_panel(native_M)
      })
    }

    // Experimental signal Checkboxes
    for (i = 0; i < exp_signal_list.length; i++) {
      var experimentCheckbox = document.getElementById(name_prefix+"ExpCheckbox #"+(i+1))
      experimentCheckbox.checked = false
      experimentCheckbox.addEventListener('change', (e) => {
        expCheckBox_change_function(e)
        update_info_panel(native_M)
      })
    }
  }
}

function protEntCheckBox_change_function(e) {
  var exp_signal_list = struct_info_dict.exp_signal_list
  var chg_ent_struct_state = struct_info_dict.chg_ent_struct_state
  var exp_signal_M_dict = struct_info_dict.exp_signal_M_dict
  var chg_ent_dict = struct_info_dict.chg_ent_dict
  var selection_dict = struct_info_dict.selection_dict

  for (struct_id in Object.keys(selection_dict)) {
    var sk = Object.keys(selection_dict)[struct_id]
    var s = struct[struct_id]
    var loop_sele = []
    var thread_sele = []
    for (i = 0; i < chg_ent_struct_state.length; i++) {
      var entanglementCheckbox = document.getElementById(sk+'EntCheckbox #'+(i+1))
      var sele = selection_dict[sk]['chg_ent'][chg_ent_struct_state[i]]
      if (entanglementCheckbox.checked) {
        loop_sele = loop_sele.concat(sele['loop'].substr(1).split(','))
        thread_sele = thread_sele.concat(sele['thread'].substr(1).split(','))
      }
      stage.getRepresentationsByName(sk+" crossing atoms #"+(i+1))
        .setVisibility(entanglementCheckbox.checked)
      stage.getRepresentationsByName(sk+" NC atoms #"+(i+1))
        .setVisibility(entanglementCheckbox.checked)
      stage.getRepresentationsByName(sk+" native contact #"+(i+1))
        .setVisibility(entanglementCheckbox.checked)
    }
    var proteinCheckbox = document.getElementById(sk+"Checkbox")
    if (proteinCheckbox.checked & loop_sele.length > 0) {
      var protein_sele = selection_dict[sk]['sel']
      var colorScheme_list = [[loop_color, '@'+([...new Set(loop_sele)].join(','))],
                              [thread_color, '@'+([...new Set(thread_sele)].join(','))],
                              [protein_color, '*']]
      var schemeId = NGL.ColormakerRegistry.addSelectionScheme(colorScheme_list, sk+"_colorScheme");
      stage.getRepresentationsByName(sk+" protein").setSelection(protein_sele)
      stage.getRepresentationsByName(sk+" protein").setColor(schemeId)
      stage.getRepresentationsByName(sk+" protein").setVisibility(true)
    }
    else if (!proteinCheckbox.checked & loop_sele.length > 0) {
      var protein_sele = '@'+([...new Set(loop_sele.concat(thread_sele))].join(','))
      var colorScheme_list = [[loop_color, '@'+([...new Set(loop_sele)].join(','))],
                              [thread_color, '@'+([...new Set(thread_sele)].join(','))],
                              [protein_color, '*']]
      var schemeId = NGL.ColormakerRegistry.addSelectionScheme(colorScheme_list, sk+"_colorScheme");
      stage.getRepresentationsByName(sk+" protein").setSelection(protein_sele)
      stage.getRepresentationsByName(sk+" protein").setColor(schemeId)
      stage.getRepresentationsByName(sk+" protein").setVisibility(true)
    }
    else if (proteinCheckbox.checked & loop_sele.length == 0) {
      var protein_sele = selection_dict[sk]['sel']
      var colorScheme_list = [[protein_color, '*']]
      var schemeId = NGL.ColormakerRegistry.addSelectionScheme(colorScheme_list, sk+"_colorScheme");
      stage.getRepresentationsByName(sk+" protein").setSelection(protein_sele)
      stage.getRepresentationsByName(sk+" protein").setColor(schemeId)
      stage.getRepresentationsByName(sk+" protein").setVisibility(true)
    }
    else {
      stage.getRepresentationsByName(sk+" protein").setVisibility(false)
    }
  }
}

function expCheckBox_change_function(e) {
  var exp_signal_list = struct_info_dict.exp_signal_list
  var chg_ent_struct_state = struct_info_dict.chg_ent_struct_state
  var exp_signal_M_dict = struct_info_dict.exp_signal_M_dict
  var chg_ent_dict = struct_info_dict.chg_ent_dict
  var selection_dict = struct_info_dict.selection_dict

  var surfaceOpacityRange = document.getElementById('surfaceOpacityRange')

  var elid = e.target.id.split('#').slice(-1)[0]
  var struct_key = e.target.id.split('Exp').slice(0,1)[0]
  var label = document.getElementById("expLabel #"+elid).innerHTML
  var signal_name = label.split(' ')[1]
  signal_name = signal_name.substr(0, signal_name.length-1)
  if (!signal_name.includes('-')) {
    // LiP-MS
    stage.getRepresentationsByName(struct_key+" LiP-MS cut-site "+signal_name)
      .setVisibility(e.target.checked)
  }
  else {
    // XL-MS
    stage.getRepresentationsByName(struct_key+" XL-MS site "+signal_name)
      .setVisibility(e.target.checked)
    stage.getRepresentationsByName(struct_key+" jwalk "+signal_name)
      .setVisibility(e.target.checked)
  }

  // Remove all surface representations
  var surface_rep_list = stage.getRepresentationsByName(/ surface/).list
  for (i in surface_rep_list) {
    surface_rep_list[i].dispose()
  }

  // Create surface for LiP-MS cut-site residues and XL-MS sites
  for (struct_id in Object.keys(selection_dict)) {
    var sk = Object.keys(selection_dict)[struct_id]
    var s = struct[struct_id]
    var lipms_surf_sele = []
    var xlms_surf_sele = []
    var tag_rest_surf = false
    for (i = 0; i < exp_signal_list.length; i++) {
      var experimentCheckbox = document.getElementById(sk+"ExpCheckbox #"+(i+1))
      var sn = document.getElementById("expLabel #"+(i+1)).innerHTML
      sn = sn.split(' ')[1]
      sn = sn.substr(0, sn.length-1)
      if (experimentCheckbox.checked) {
        if (!sn.includes('-')) {
          lipms_surf_sele = lipms_surf_sele.concat(selection_dict[sk]['lipms'][sn]['surf_sel'].substr(1).split(','))
        }
        else {
          var xl_pair_sele = selection_dict[sk]['xlms'][sn]['site_sel']
          s.structure.eachResidue(function (rp) {
            rp.eachAtom(function (aap) {
              xlms_surf_sele.push(aap.index.toString())
            })
          }, new NGL.Selection(xl_pair_sele))
        }
      }
      if (experimentCheckbox.checked) {
        tag_rest_surf = true
      }
    }
    if (lipms_surf_sele.length > 0) {
      var surf_sele = '@'+([...new Set(lipms_surf_sele)].join(','))
      r = s.addRepresentation("surface", {
        sele: surf_sele,
        probeRadius: 1.4,
        scaleFactor: 1.0,
        surfaceType: "av",
        color: lipms_color,
        opacity: parseFloat(surfaceOpacityRange.value) / 100,
        background: false,
        side: "front",
        opaqueBack: true,
        metalness: 0,
        roughness: 1,
        quality: "high",
        name: sk+" LiP-MS cut-site surface"
      })
      r.setVisibility(true)
    }
    if (xlms_surf_sele.length > 0) {
      var surf_sele = '@'+([...new Set(xlms_surf_sele)].join(','))
      r = s.addRepresentation("surface", {
        sele: surf_sele,
        probeRadius: 1.4,
        scaleFactor: 1.0,
        surfaceType: "av",
        color: xlms_color,
        opacity: parseFloat(surfaceOpacityRange.value) / 100,
        background: false,
        side: "front",
        opaqueBack: true,
        metalness: 0,
        roughness: 1,
        quality: "high",
        name: sk+" XL-MS site surface"
      })
      r.setVisibility(true)
    }
    // Create surface for rest residues
    if (tag_rest_surf) {
      var all_sele = selection_dict[sk]['sel'].substr(1).split(',')
      var exp_surf_sele = lipms_surf_sele.concat(xlms_surf_sele)
      var rest_sele = []
      for (i = 0; i < all_sele.length; i++) {
        if (exp_surf_sele.indexOf(all_sele[i]) == -1) {
          rest_sele.push(all_sele[i])
        }
      }
      var rest_surf_sele = '@'+rest_sele.join(',')
      r = s.addRepresentation("surface", {
        sele: rest_surf_sele,
        probeRadius: 1.4,
        scaleFactor: 1.0,
        surfaceType: "av",
        color: protein_color,
        background: false,
        opacity: parseFloat(surfaceOpacityRange.value) / 100,
        side: "front",
        opaqueBack: true,
        metalness: 0,
        roughness: 1,
        quality: "high",
        name: sk+" rest surface"
      })
      r.setVisibility(true)
    }
    // reset_view()
  }
}

function update_info_panel(native_M) {
  var exp_signal_list = struct_info_dict.exp_signal_list
  var chg_ent_struct_state = struct_info_dict.chg_ent_struct_state
  var exp_signal_M_dict = struct_info_dict.exp_signal_M_dict
  var chg_ent_dict = struct_info_dict.chg_ent_dict
  var selection_dict = struct_info_dict.selection_dict

  // set info
  var info_div = document.getElementById("info")
  info_div.innerHTML = "";

  var info_div_table = createTable('infoDiv', 2, 3, false)
  info_div.appendChild(info_div_table)
  Object.assign(info_div_table.style, {height: "100%", 
                                       'width': '100%',
                                       'table-layout': 'fixed',})
  Object.assign(document.getElementById('infoDiv_row_0').style, {height: "15%",})
  Object.assign(document.getElementById('infoDiv_row_1').style, {height: "85%",})
  document.getElementById('infoDiv_cell_0_1').remove()
  document.getElementById('infoDiv_cell_0_2').remove()
  var cell = document.getElementById('infoDiv_cell_0_0')
  cell.setAttribute('colspan', '3')
  cell.appendChild(createElement('div', {
    innerHTML: "<span title='Fraction of native contacts formed' onmouseover='this.style.cursor=\"help\"'><i>Q</i></span> = " +
               struct_info_dict.Q.toFixed(4) + ", " +
               "<span title='Fraction of native contacts associated with changes in entanglements' onmouseover='this.style.cursor=\"help\"'><i>G</i></span> = " +
               struct_info_dict.G.toFixed(4)
  }, { 'text-align': 'center',
       'vertical-align': 'middle',
       'font-family': 'Arial',
       'font-size': '1.6vmin',
  }))

  var ent_info_div = createElement("div", {
    id: "ent_info_div",
  }, { height: "90%",
       "margin-left": "5%",
       "margin-right": "5%",
       overflow: "auto",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",
       'background-color': 'none'})
  Object.assign(document.getElementById('infoDiv_cell_1_0').style, 
                  {width: "33%",
                   'text-align': 'center',
                   'vertical-align': 'middle',})
  document.getElementById('infoDiv_cell_1_0').appendChild(ent_info_div)
  ent_info_div.innerHTML = "<span><b>Entanglement information table</b></span> "
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('entInfoTableHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  ent_info_div.appendChild(help_icon)
  // add a table of entanglements
  var table = document.createElement('table');
  table.setAttribute('border', '1');
  var thead = document.createElement('thead');
  table.appendChild(thead);
  var headRow = document.createElement('tr');
  thead.appendChild(headRow);
  var columns = ["ID", "code", "protein", "linking number", "native contact", "crossings"]
  columns.forEach(column => {
    var headCell = document.createElement('th');
    headCell.innerHTML = column;
    headRow.appendChild(headCell);
  });
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);
  for (var i = 0; i < chg_ent_struct_state.length; i++) {
    var chg_ent_id = chg_ent_struct_state[i]
    var row_native = document.createElement('tr');
    var row_misfold = document.createElement('tr');
    var native_color = ''
    if (document.getElementById('nativeEntCheckbox #'+(i+1)).checked) {
      native_color = '#D3D3D3'
    }
    var misfold_color = ''
    if (document.getElementById('misfoldedEntCheckbox #'+(i+1)).checked) {
      misfold_color = '#D3D3D3'
    }
    columns.slice(0,2).forEach(column => {
      var cell = document.createElement('td');
      switch (column) {
        case "ID":
          cell.innerHTML = chg_ent_id
          break
        case "code":
          cell.innerHTML = "("+chg_ent_dict[chg_ent_id][column]+")"
          break
      }
      cell.setAttribute('rowSpan', '2');
      row_native.appendChild(cell);
    });
    columns.slice(2).forEach(column => {
      var cell_native = document.createElement('td');
      if (native_color != '') {
        cell_native.setAttribute('bgcolor', native_color);
      }
      var cell_misfold = document.createElement('td');
      if (misfold_color != '') {
        cell_misfold.setAttribute('bgcolor', misfold_color);
      }
      switch (column) {
        case "protein":
          cell_native.innerHTML = 'N'
          cell_misfold.innerHTML = 'M'
          break
        case "linking number":
          cell_native.innerHTML = "("+chg_ent_dict[chg_ent_id]['ref_linking_number']+")"
          cell_misfold.innerHTML = "("+chg_ent_dict[chg_ent_id]['linking_number']+")"
          break
        case "native contact":
          cell_native.innerHTML = "("+chg_ent_dict[chg_ent_id]['ref_native_contact'].map(v=> v+1)+")"
          cell_misfold.innerHTML = "("+chg_ent_dict[chg_ent_id]['native_contact'].map(v=> v+1)+")"
          break
        case "crossings":
          var native_crossing = []
          for (var j = 0; j < chg_ent_dict[chg_ent_id]['ref_crossing_resid'].length; j++) {
            var nc = []
            for (var k = 0; k < chg_ent_dict[chg_ent_id]['ref_crossing_resid'][j].length; k++) {
              nc.push(chg_ent_dict[chg_ent_id]['ref_crossing_pattern'][j].substr(k,k+1)+(chg_ent_dict[chg_ent_id]['ref_crossing_resid'][j][k]+1))
            }
            native_crossing.push("("+nc+")")
          }
          cell_native.innerHTML = "("+native_crossing+")"
          var misfold_crossing = []
          for (var j = 0; j < chg_ent_dict[chg_ent_id]['crossing_resid'].length; j++) {
            var nc = []
            for (var k = 0; k < chg_ent_dict[chg_ent_id]['crossing_resid'][j].length; k++) {
              nc.push(chg_ent_dict[chg_ent_id]['crossing_pattern'][j].substr(k,k+1)+(chg_ent_dict[chg_ent_id]['crossing_resid'][j][k]+1))
            }
            misfold_crossing.push("("+nc+")")
          }
          cell_misfold.innerHTML = "("+misfold_crossing+")"
          break
      }
      row_native.appendChild(cell_native);
      row_misfold.appendChild(cell_misfold);
    });
    tbody.appendChild(row_native);
    tbody.appendChild(row_misfold);
  }
  ent_info_div.appendChild(table);

  // Get LiP-MS and XL-MS data
  var head_lipms = ['site', 'native SASA (&#8491;<sup>2</sup>)', 'SASA (&#8491;<sup>2</sup>)', 'native ensemble SASA (95% CI) (&#8491;<sup>2</sup>)']
  var head_xlms = ['site', 'native XL propensity', 'native jwalk (&#8491;)', 'XL propensity', 'jwalk (&#8491;)', 'native ensemble XL propensity (95% CI)']
  var data_lipms = []
  var data_xlms = []
  var checked_lipms = []
  var checked_xlms = []
  var lipms_idx = 0
  var xlms_idx = 0
  for (var i = 0; i < exp_signal_list.length; i++) {
    var signal_name = exp_signal_list[i]
    var checked_native = document.getElementById("nativeExpCheckbox #"+(i+1)).checked
    var checked_misfold = document.getElementById("misfoldedExpCheckbox #"+(i+1)).checked
    if (!signal_name.includes('-')) {
      // LiP-MS signal
      var misfold_M = exp_signal_M_dict[signal_name]['M'].toFixed(1)
      var crystal_M = native_M['native']['lipms'][signal_name]['M'].toFixed(1)
      var native_mean = native_M['native_ensemble']['lipms'][signal_name]['mean'].toFixed(1)
      var native_lb = native_M['native_ensemble']['lipms'][signal_name]['lb'].toFixed(1)
      var native_ub = native_M['native_ensemble']['lipms'][signal_name]['ub'].toFixed(1)
      if (checked_native) {
        checked_lipms.push([lipms_idx, 1])
      }
      if (checked_misfold) {
        checked_lipms.push([lipms_idx, 2])
      }
      lipms_idx += 1
    }
    else {
      var misfold_M = exp_signal_M_dict[signal_name]['M'].toFixed(4)
      var misfold_jwalk = exp_signal_M_dict[signal_name]['jwalk'].toFixed(1)
      var crystal_M = native_M['native']['xlms'][signal_name]['M'].toFixed(4)
      var crystal_jwalk = native_M['native']['xlms'][signal_name]['jwalk'].toFixed(1)
      var native_mean = native_M['native_ensemble']['xlms'][signal_name]['mean'].toFixed(4)
      var native_lb = native_M['native_ensemble']['xlms'][signal_name]['lb'].toFixed(4)
      var native_ub = native_M['native_ensemble']['xlms'][signal_name]['ub'].toFixed(4)
      if (checked_native) {
        checked_xlms.push([xlms_idx, 1])
        checked_xlms.push([xlms_idx, 2])
      }
      if (checked_misfold) {
        checked_xlms.push([xlms_idx, 3])
        checked_xlms.push([xlms_idx, 4])
      }
      xlms_idx += 1
    }
    if (!signal_name.includes('-')) {
      var data = [signal_name, crystal_M, misfold_M, native_mean+' ('+native_lb+','+native_ub+')']
      data_lipms.push(data)
    }
    else {
      var data = [signal_name, crystal_M, crystal_jwalk, misfold_M, misfold_jwalk, native_mean+' ('+native_lb+','+native_ub+')']
      data_xlms.push(data)
    }
  }

  Object.assign(document.getElementById('infoDiv_cell_1_1').style, 
                  {width: "33%",
                   'text-align': 'center',
                   'vertical-align': 'middle',})
  var lipms_chart_table_button = createElement("input", {
    id: "lipms_chart_table_button",
    type: "button",
    value: "Show chart",
    onclick: function (e) {
      if (e.target.value == "Show table") {
        e.target.value = "Show chart"
        document.getElementById('lipms_chart_div').style.display = 'none'
        document.getElementById('lipms_info_div').style.display = 'block'
      }
      else {
        e.target.value = "Show table"
        document.getElementById('lipms_info_div').style.display = 'none'
        document.getElementById('lipms_chart_div').style.display = 'block'
      }
    }
  }, { height: "10%",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",})
  document.getElementById('infoDiv_cell_1_1').appendChild(lipms_chart_table_button)

  var lipms_chart_div = createElement("div", {
    id: "lipms_chart_div",
  }, { height: "80%",
       "margin-top": "1%",
       "margin-right": "5%",
       "margin-left": "5%",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",
       display: 'none',
       'background-color': 'white'})
  document.getElementById('infoDiv_cell_1_1').appendChild(lipms_chart_div)
  var canvas = createElement("canvas", {
    id: "lipms_chart_canvas",
  }, { })
  lipms_chart_div.appendChild(canvas)
  var labels = []
  var data_M_native = []
  var data_M_misfold = []
  var data_native_ensemble = []
  for (var i = 0; i < data_lipms.length; i++) {
    labels.push(data_lipms[i][0])
    data_M_native.push(data_lipms[i][1])
    data_M_misfold.push(data_lipms[i][2])
    var str = data_lipms[i][3].split(' ')[1]
    data_native_ensemble.push(str.substr(1,str.length-2).split(','))
  }
  const lipms_chart = new Chart(canvas, {
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: '95% CI of native ensemble SASA',
          data: data_native_ensemble,
          borderColor: 'black',
          backgroundColor: 'rgba(128,128,128,0.5)',
          borderWidth: 0,
        },
        {
          type: 'scatter',
          label: 'Native structure SASA',
          data: data_M_native,
          radius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          hoverRadius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          borderColor: 'black',
          backgroundColor: 'green',
          borderWidth: (pt) => {
            if (checked_lipms.some(a => {
              const [x, y] = a
              return x === pt.index && y === 1
             })) {
              if (pt.dataset.data.length > 0) {
                return 0.1 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
              }
              else {
                return 0
              }
            }
            else {
              return 0
            }
          },
        },
        {
          type: 'scatter',
          label: 'Misfolded structure SASA',
          data: data_M_misfold,
          radius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          hoverRadius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          borderColor: 'black',
          backgroundColor: 'magenta',
          borderWidth: (pt) => {
            if (checked_lipms.some(a => {
              const [x, y] = a
              return x === pt.index && y === 2
             })) {
              if (pt.dataset.data.length > 0) {
                return 0.1 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
              }
              else {
                return 0
              }
            }
            else {
              return 0
            }
          },
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: {
        duration: 0
      },
      plugins: {
        title: {
          display: true,
          text: 'LiP-MS signal chart',
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed._custom != null) {
                label += '[' + context.parsed._custom.barStart + ', ' + context.parsed._custom.barEnd + '] Å²'
              }
              else if (context.parsed.x != null) {
                label += context.parsed.x + ' Å²'
              }
              return label;
            },
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'y',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'y',
          }
        }
      },
      scales: {
        x: {
          display: true,
          beginAtZero: false,
          title: {
            display: true,
            text: 'SASA (Å²)'
          }
        },
        y: {
          ticks: {
            autoSkip: false
          }
        }
      },
    }
  });

  lipms_chart.config.options.animation.duration = 1000

  var lipms_info_div = createElement("div", {
    id: "lipms_info_div",
  }, { height: "80%",
       "margin-top": "1%",
       "margin-right": "5%",
       "margin-left": "5%",
       overflow: "auto",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",
       'background-color': 'none',
       display: 'block',})
  document.getElementById('infoDiv_cell_1_1').appendChild(lipms_info_div)
  lipms_info_div.innerHTML = "<span><b>LiP-MS signal table</b></span> "
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('lipmsInfoTableHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  lipms_info_div.appendChild(help_icon)
  
  // add a table of LiPMS experimental signals
  var table = document.createElement('table');
  table.setAttribute('border', '1');
  var thead = document.createElement('thead');
  table.appendChild(thead);
  var headRow = document.createElement('tr');
  thead.appendChild(headRow);
  head_lipms.forEach(column => {
    var headCell = document.createElement('th');
    headCell.innerHTML = column;
    headRow.appendChild(headCell);
  });
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);
  for (var i = 0; i < data_lipms.length; i++) {
    var row = document.createElement('tr');
    for (var j = 0; j < data_lipms[i].length; j++) {
      var cell = document.createElement('td');
      cell.innerHTML = data_lipms[i][j];
      if (checked_lipms.some(a => {
          const [x, y] = a
          const b = [i, j]
          return x === b[0] && y === b[1]
         })) {
        cell.setAttribute('bgcolor', '#D3D3D3');
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  lipms_info_div.appendChild(table)
  
  Object.assign(document.getElementById('infoDiv_cell_1_2').style, 
                  {width: "33%",
                   'text-align': 'center',
                   'vertical-align': 'middle',})
  var xlms_chart_table_button = createElement("input", {
    id: "xlms_chart_table_button",
    type: "button",
    value: "Show chart",
    onclick: function (e) {
      if (e.target.value == "Show table") {
        e.target.value = "Show chart"
        document.getElementById('xlms_chart_div').style.display = 'none'
        document.getElementById('xlms_info_div').style.display = 'block'
      }
      else {
        e.target.value = "Show table"
        document.getElementById('xlms_info_div').style.display = 'none'
        document.getElementById('xlms_chart_div').style.display = 'block'
      }
    }
  }, { height: "10%",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",})
  document.getElementById('infoDiv_cell_1_2').appendChild(xlms_chart_table_button)

  var xlms_chart_div = createElement("div", {
    id: "xlms_chart_div",
  }, { height: "80%",
       "margin-top": "1%",
       "margin-right": "5%",
       "margin-left": "5%",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",
       display: 'none',
       'background-color': 'white'})
  document.getElementById('infoDiv_cell_1_2').appendChild(xlms_chart_div)
  var canvas = createElement("canvas", {
    id: "xlms_chart_canvas",
  }, { })
  xlms_chart_div.appendChild(canvas)
  var labels = []
  var data_M_native = []
  var data_M_misfold = []
  var data_native_ensemble = []
  for (var i = 0; i < data_xlms.length; i++) {
    labels.push(data_xlms[i][0])
    data_M_native.push(data_xlms[i][1])
    data_M_misfold.push(data_xlms[i][3])
    var str = data_xlms[i][5].split(' ')[1]
    data_native_ensemble.push(str.substr(1,str.length-2).split(','))
  }
  const xlms_chart = new Chart(canvas, {
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: '95% CI of native ensemble XL',
          data: data_native_ensemble,
          borderColor: 'black',
          backgroundColor: 'rgba(128,128,128,0.5)',
          borderWidth: 0,
        },
        {
          type: 'scatter',
          label: 'Native structure XL',
          data: data_M_native,
          radius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          hoverRadius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          borderColor: 'black',
          backgroundColor: 'green',
          borderWidth: (pt) => {
            if (checked_xlms.some(a => {
              const [x, y] = a
              return x === pt.index && y === 1
             })) {
              if (pt.dataset.data.length > 0) {
                return 0.1 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
              }
              else {
                return 0
              }
            }
            else {
              return 0
            }
          },
        },
        {
          type: 'scatter',
          label: 'Misfolded structure XL',
          data: data_M_misfold,
          radius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          hoverRadius: (pt) => {
            if (pt.dataset.data.length > 0) {
              return 0.3 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
            }
            else {
              return 0
            }
          },
          borderColor: 'black',
          backgroundColor: 'magenta',
          borderWidth: (pt) => {
            if (checked_xlms.some(a => {
              const [x, y] = a
              return x === pt.index && y === 3
             })) {
              if (pt.dataset.data.length > 0) {
                return 0.1 * pt.chart.scales.y._length / (pt.chart.scales.y.max - pt.chart.scales.y.min + 1)
              }
              else {
                return 0
              }
            }
            else {
              return 0
            }
          },
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: {
        duration: 0
      },
      plugins: {
        title: {
          display: true,
          text: 'XL-MS signal chart',
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed._custom != null) {
                label += '[' + context.parsed._custom.barStart + ', ' + context.parsed._custom.barEnd + ']'
              }
              else if (context.parsed.x != null) {
                label += context.parsed.x
              }
              return label;
            },
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'y',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'y',
          }
        }
      },
      scales: {
        x: {
          display: true,
          beginAtZero: false,
          title: {
            display: true,
            text: 'XL'
          }
        },
        y: {
          ticks: {
            autoSkip: false
          }
        }
      },
    }
  });

  xlms_chart.config.options.animation.duration = 1000

  var xlms_info_div = createElement("div", {
    id: "xlms_info_div",
  }, { height: "80%",
       "margin-top": "1%",
       "margin-right": "5%",
       "margin-left": "5%",
       overflow: "auto",
       "font-family": "Arial", 
       "font-size": "1.3vmin",
       "text-align": "center",
       'background-color': 'none',
       'display': 'block'})
  document.getElementById('infoDiv_cell_1_2').appendChild(xlms_info_div)
  xlms_info_div.innerHTML = "<span><b>XL-MS signal table</b></span> "
  var help_icon = creatHelpIcon("1.4vmin")
  Object.assign(help_icon.style, {'vertical-align': 'middle'})
  help_icon.addEventListener('click', (e) => {
    var help_div = document.getElementById('xlmsInfoTableHelp_div')
    help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    help_div.style.display = 'block'
  })
  xlms_info_div.appendChild(help_icon)
  // add a table of XLMS experimental signals
  var table = document.createElement('table');
  table.setAttribute('border', '1');
  var thead = document.createElement('thead');
  table.appendChild(thead);
  var headRow = document.createElement('tr');
  thead.appendChild(headRow);
  head_xlms.forEach(column => {
    var headCell = document.createElement('th');
    headCell.innerHTML = column;
    headRow.appendChild(headCell);
  });
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);
  for (var i = 0; i < data_xlms.length; i++) {
    var row = document.createElement('tr');
    for (var j = 0; j < data_xlms[i].length; j++) {
      var cell = document.createElement('td');
      cell.innerHTML = data_xlms[i][j];
      if (checked_xlms.some(a => {
          const [x, y] = a
          const b = [i, j]
          return x === b[0] && y === b[1]
         })) {
        cell.setAttribute('bgcolor', '#D3D3D3');
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  xlms_info_div.appendChild(table)
}

function export_image() {
  if (stage.compList.length > 0) {
    // Render the molecular structure
    stage.makeImage({
        trim: false,
        factor: 5, // Increase factor for better quality (optional)
        antialias: true, // Enable antialiasing (optional)
        transparent: false,
    }).then(function(blob) {
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'structure.png';
        link.click();
    });
  }
}

function download_pdb() {
  if (stage.compList.length > 0) {
    window.open(stage.getComponentsByName('struct.pdb').list[0].structure.path)
  }
}

function update_checkbox_div_height() {
  const cntrl_panel = document.getElementById('cntrl_panel')
  var h = cntrl_panel.clientHeight
  const children = cntrl_panel.children;
  for (var i = 0; i < children.length; i++) {
    var element = children[i];
    if (element.id != 'checkbox_div') {
      var h0 = element.offsetHeight + parseFloat(getComputedStyle(element).marginTop) + parseFloat(getComputedStyle(element).marginBottom);
      h = h - h0
    }
  }
  var checkbox_div = document.getElementById('checkbox_div')
  checkbox_div.style.height = h+'px'
}

function close_help_div(elem) {
  var help_div = elem.parentElement
  help_div.getElementsByTagName('div')[0].scrollTop = 0
  help_div.style.display = 'none'
}

function change_surfaceOpacity(elem) {
  document.getElementById('surface_opacity_value_div').innerHTML = (parseFloat(elem.value) / 100).toFixed(2);
  var surface_rep_list = stage.getRepresentationsByName(/ surface/).list; 
  for (i in surface_rep_list) {
    surface_rep_list[i].setParameters({opacity: parseFloat(elem.value) / 100})
  }
}

//////////////////////// Generate page contents //////////////////////////////
function gen_major_contents(selectbox_json) {
  // Remove all contents except datasetTable_table
  var children = document.getElementById("cntrl_panel").children
  var remove_children_list = []
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.id != 'datasetTable_table') {
      remove_children_list.push(child)
    }
  }
  for (var i in remove_children_list) {
    document.getElementById("cntrl_panel").removeChild(remove_children_list[i]);
  }
  document.getElementById("info").innerHTML = "";
  stage.removeAllComponents();

  // Create new contents
  var selectTable = createTable('selectTable', 6, 1, false)
  document.getElementById("cntrl_panel").appendChild(selectTable)
  Object.assign(selectTable.style, { 
    width: "100%",
    "text-align": "left",
  })
  document.getElementById("selectTable_cell_0_0").appendChild(createElement("span", {
    innerHTML: "<b>2. Select a metastable state below:</b>"
  }, { "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.4vmin"}))

  var MetaStateSelect = createSelect([["", "--Please choose an option--"]], {
    onchange: function (e) {
      //Remove structural visualization
      document.getElementById("checkbox_div").innerHTML = "";
      document.getElementById("info").innerHTML = "";
      stage.removeAllComponents();

      var ExpSig_option_array = null;
      var Struct_option_array = null;
      if (e.target.value == "") {
        //Remove all options in ExpSigChoice
        ExpSig_option_array = [{ value: "", 
                                 label: "--Wait for above option--", 
                                 selected: true }]

        //Remove all options in StructSelect
        Struct_option_array = [{ value: "", 
                                 label: "--Wait for above option--", 
                                 selected: true }]
      }
      else {
        //Remove all options in ExpSigChoice and add new options
        ExpSig_option_array = [{ value: "", 
                                 label: "--Please choose an option--", 
                                 selected: true }]
        var data_1 = JSON.parse(e.target.value)
        data_1.forEach(item => {
          ExpSig_option_array.push({ value: JSON.stringify(item.value), 
                                     label: item.text })
        });

        //Remove all options in StructSelect
        Struct_option_array = [{ value: "", 
                                 label: "--Wait for above option--", 
                                 selected: true }]
      }
      
      ExpSigChoice.clearStore();
      ExpSigChoice.setChoices(
        ExpSig_option_array,
        'value',
        'label',
        true,
      );
      StructChoice.clearStore();
      StructChoice.setChoices(
        Struct_option_array,
        'value',
        'label',
        true,
      );
    },
  }, { width: "98%",
       "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.2vmin"})
  document.getElementById("selectTable_cell_1_0").appendChild(MetaStateSelect)

  var MetaStateChoice = new Choices(MetaStateSelect, {
    searchEnabled: true,
    allowHTML: true,
    shouldSort: false,
    paste: true,
    searchFields: ['label'],
    searchResultLimit: 100,
    searchPlaceholderValue: "Search a State ID",
    fuseOptions: {
      includeScore: true,
      threshold: 0,
    }
  });

  document.getElementById("selectTable_cell_2_0").appendChild(createElement("span", {
    innerHTML: "<b>3. Select a combinition of experimental signals below:</b>"
  }, { "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.4vmin"}))

  var ExpSigSelect = createSelect([["", "--Wait for above option--"]], {
    onchange: function (e) {
      //Remove structural visualization
      document.getElementById("checkbox_div").innerHTML = "";
      document.getElementById("info").innerHTML = "";
      stage.removeAllComponents();

      var Struct_option_array = null;
      if (e.target.value == "") {
        //Remove all options in StructChoice
        Struct_option_array = [{ value: "", 
                                 label: "--Wait for above option--", 
                                 selected: true }]
      }
      else {
        Struct_option_array = [{ value: "", 
                                 label: "--Please choose an option--", 
                                 selected: true }]
        var data_1 = JSON.parse(e.target.value)
        data_1.forEach(item => {
          Struct_option_array.push({ value: JSON.stringify(item.value), 
                                     label: item.text })
        });
      }
      StructChoice.clearStore();
      StructChoice.setChoices(
        Struct_option_array,
        'value',
        'label',
        true,
      );
    }
  }, { width: "98%",
       "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.2vmin"})
  document.getElementById("selectTable_cell_3_0").appendChild(ExpSigSelect)

  var ExpSigChoice = new Choices(ExpSigSelect, {
    searchEnabled: true,
    allowHTML: true,
    shouldSort: false,
    paste: true,
    searchFields: ['label'],
    searchResultLimit: 100,
    searchPlaceholderValue: "Search a set of experimental signals",
    fuseOptions: {
      includeScore: true,
      threshold: 0,
    }
  });

  document.getElementById("selectTable_cell_4_0").appendChild(createElement("span", {
    innerHTML: "<b>4. Select a combinition of changes in entanglements below:</b>"
  }, { "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.4vmin"}))

  var StructSelect = createSelect([["", "--Wait for above option--"]], {
    onchange: function (e) {
      if (e.target.value != "") {
        var info_path = "./"+MetaStateSelect.options[MetaStateSelect.selectedIndex].text.replace(/ /g, "_");
        info_path += "/"+ExpSigSelect.options[ExpSigSelect.selectedIndex].text.replace(/, /g, "_");
        info_path += "/"+e.target.value.substr(1,e.target.value.length-2);
        loadStructure(info_path)
      }
      else {
        //Remove structural visualization
        document.getElementById("checkbox_div").innerHTML = "";
        document.getElementById("info").innerHTML = "";
        stage.removeAllComponents();
      }
    },
  }, { width: "98%",
       "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.2vmin"})
  document.getElementById("selectTable_cell_5_0").appendChild(StructSelect)

  var StructChoice = new Choices(StructSelect, {
    searchEnabled: true,
    allowHTML: true,
    shouldSort: false,
    paste: true,
    searchFields: ['label'],
    searchResultLimit: 100,
    searchPlaceholderValue: "Search a set of entanglement changes",
    fuseOptions: {
      includeScore: true,
      threshold: 0,
    }
  });

  // Fetch JSON data and add options to MetaStateSelect
  fetch(selectbox_json, {cache: "no-cache"})
    .then(response => response.json())
    .then(data => {
      var option_array = []
      // Loop through the data and create options for the select box
      data.forEach(item => {
        option_array.push({ value: JSON.stringify(item.value), 
                            label: item.text })
      });
      MetaStateChoice.setChoices(
        option_array,
        'value',
        'label',
        false,
      );
    })
    .catch(error => console.error('Error fetching data:', error));


  var buttonTable = createTable('buttonTable', 1, 5, false)
  document.getElementById("cntrl_panel").appendChild(buttonTable)
  Object.assign(buttonTable.style, { 
    width: "100%",
    "text-align": "left",
    "font-family": "Arial",
    "font-size": "1.4vmin",
    "margin-top": "3%",
  })

  var alignSelect = createSelect(alignSelect_options, {
    id: "alignSelect",
    onchange: function (e) {
      // Align structures
      var selection_dict = struct_info_dict.selection_dict
      var sele_list = []
      for (var i = 0; i < struct.length; i++) {
        var s = struct[i]
        var sel_1 = selection_dict[Object.keys(selection_dict)[i]]['align_sel']
        var sel_2 = alignSelect.value
        var sele_1 = []
        var sele_2 = []
        var sele = []
        s.structure.eachAtom(function (ap) {
          sele_1.push(ap.index.toString())
        }, new NGL.Selection(sel_1+' and .CA'))
        s.structure.eachAtom(function (ap) {
          var idx = ap.index.toString()
          sele_2.push(idx)
          if (sele_1.indexOf(idx) != -1) {
            sele.push(idx)
          }
        }, new NGL.Selection(sel_2+' and .CA'))
        // If the intersection is too small 
        // (less than half of the original set), 
        // not use the intersection set
        if (sele.length / sele_2.length < 0.5) {
          sele = sele_2
        }
        sele = '@'+sele.join(',')
        sele_list.push(sele)
      }
      for (var i = 1; i < struct.length; i++) {
        _align_structures(struct[0], struct[i], sele_list[0], sele_list[i])
      }
      // reset_view()
    },
  }, { "vertical-align": "middle",
       "font-family": "Arial", 
       "font-size": "1.2vmin"})
  var alignSelect_div = createElement('div', {
    title: "Align structures on the selected region",
    innerHTML: "<span>Align on </span>",
  }, { cursor: "default", })
  alignSelect_div.appendChild(alignSelect)
  document.getElementById("buttonTable_cell_0_0").appendChild(alignSelect_div)

  var settingButtonIcon = creatSettingIcon('2.0vmin')
  settingButtonIcon.addEventListener('click', (e) => {
    var setting_div = document.getElementById('sceneSetting_div')
    setting_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
    setting_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
    setting_div.style.display = 'block'
  })

  document.getElementById("buttonTable_cell_0_1").appendChild(settingButtonIcon)

  var centerButtonIcon = creatCenterIcon('2.0vmin')
  centerButtonIcon.addEventListener('click', (e) => {
    reset_view();
  })
  document.getElementById("buttonTable_cell_0_2").appendChild(centerButtonIcon)

  var exportButtonIcon = creatExportIcon('2.0vmin')
  exportButtonIcon.addEventListener('click', (e) => {
    export_image();
  })
  document.getElementById("buttonTable_cell_0_3").appendChild(exportButtonIcon)

  var downloadButtonIcon = creatDownloadIcon('2.0vmin')
  downloadButtonIcon.addEventListener('click', (e) => {
    download_pdb()
  })
  document.getElementById("buttonTable_cell_0_4").appendChild(downloadButtonIcon)

  document.getElementById("cntrl_panel").appendChild(createElement("div", {
    innerHTML: "<b><i>Check/uncheck the following options to show/hide:</i></b>",
    id: "checkbox_head_div",
  }, { margin: "1%",
       "margin-top": "3%",
       "font-family": "Arial", 
       "font-size": "1.4vmin"}))

  // initialize the checkbox panel
  var checkbox_div = createElement("div", { 
    id: "checkbox_div" 
  }, { "margin-top": "1%",
       width: "100%",
       height: "20vh",
       overflow: "auto",
       backgroundColor: "#F0FFF0",})
  document.getElementById("cntrl_panel").appendChild(checkbox_div)

  update_checkbox_div_height();
}

// Generate the selections for datasets
var datasetTable = createTable('datasetTable', 2, 2, false)
document.getElementById("cntrl_panel").appendChild(datasetTable)
Object.assign(datasetTable.style, { 
  width: "100%",
  "text-align": "left",
})
document.getElementById('datasetTable_cell_0_1').remove()
var cell = document.getElementById('datasetTable_cell_0_0')
cell.setAttribute('colspan', '2')
cell.appendChild(createElement("span", {
  innerHTML: "<b>1. Choose a dataset below: </b>"
}, { "vertical-align": "middle",
     "font-family": "Arial", 
     "font-size": "1.4vmin"}))
var help_icon = creatHelpIcon("1.4vmin")
Object.assign(help_icon.style, {'vertical-align': 'middle'})
help_icon.addEventListener('click', (e) => {
  var help_div = document.getElementById('datasetTableHelp_div')
  help_div.style.top = e.target.getBoundingClientRect().top+document.documentElement.scrollTop+e.target.getBoundingClientRect().height+'px'
  help_div.style.left = e.target.getBoundingClientRect().left+document.documentElement.scrollLeft+e.target.getBoundingClientRect().width+'px'
  help_div.style.display = 'block'
})
cell.appendChild(help_icon)
var downloadDatasetIcon = creatDownloadIcon('1.4vmin')
downloadDatasetIcon.children[0].innerHTML = 'Download the summary file of the dataset'
Object.assign(downloadDatasetIcon.style, {'vertical-align': 'middle',
                                          'padding-left': '4%',})
downloadDatasetIcon.addEventListener('click', (e) => {
  window.open('./Dataset_summary.xlsx')
})
cell.appendChild(downloadDatasetIcon)
var repStructRadio = createElement("input", {
  type: "radio", 
  name: "datasetOption",
  id: "repStructRadio",
  value: "./selectbox_repr.json",
  onmouseover: function () {
    this.style.cursor = 'pointer'
  }
}, { width: "1.4vmin",
     height: "1.4vmin",
     margin: "0px",
     "vertical-align": "middle",})
repStructRadio.checked = true
repStructRadio.addEventListener('change', (e) => {
  if (e.target.checked) {
    gen_major_contents(e.target.value)
  }
})
document.getElementById("datasetTable_cell_1_0").appendChild(repStructRadio)
var label = createElement("label", {
  innerText: "Repr. structures",
  title: "Representative structures",
  onmouseover: function () {
    this.style.cursor = 'pointer'
  }
}, { "margin-left": "0.5vmin",
     "vertical-align": "middle",
     "font-family": "Arial", 
     "font-size": "1.4vmin" })
label.setAttribute("for", "repStructRadio")
document.getElementById("datasetTable_cell_1_0").appendChild(label)
var repEnsembleRadio = createElement("input", {
  type: "radio", 
  name: "datasetOption",
  id: "repEnsembleRadio",
  value: "./selectbox_all.json",
  onmouseover: function () {
    this.style.cursor = 'pointer'
  }
}, { width: "1.4vmin",
     height: "1.4vmin",
     margin: "0px",
     "vertical-align": "middle",})
repEnsembleRadio.addEventListener('change', (e) => {
  if (e.target.checked) {
    gen_major_contents(e.target.value)
  }
})
document.getElementById("datasetTable_cell_1_1").appendChild(repEnsembleRadio)
var label = createElement("label", {
  innerText: "Repr. ensemble",
  title: "Representative structural ensemble",
  onmouseover: function () {
    this.style.cursor = 'pointer'
  }
}, { "margin-left": "0.5vmin",
     "vertical-align": "middle",
     "font-family": "Arial", 
     "font-size": "1.4vmin" })
label.setAttribute("for", "repEnsembleRadio")
document.getElementById("datasetTable_cell_1_1").appendChild(label)

gen_major_contents("./selectbox_repr.json")