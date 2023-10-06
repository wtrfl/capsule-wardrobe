// util
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randFromArray = (arr) => arr[randInt(0,arr.length-1)];
const saveChanges = () => localStorage.setItem('data', JSON.stringify(data));

const closeAll = () => {
    document.getElementById('home-page').classList.remove('shown');
    document.getElementById('wardrobes-page').classList.remove('shown');
    document.getElementById('create-page').classList.remove('shown');
    document.getElementById('clothes-page').classList.remove('shown');
    document.getElementById('settings-page').classList.remove('shown');
}

const modalContainer = document.getElementById('modalContainer'),
      modalButton1 = document.getElementById('modalButton1'),
      modalButton2 = document.getElementById('modalButton2');
const modalCloseActions = () => {
    modalContainer.classList.remove('shown');
    modalButton1.display = 'block';
    modalButton1.classList.remove('normal', 'danger')
}
const newModal = (head, body, button1, button2, actionStyle, onCancel, onAccept) => {
    $("#headerText").html(head);
    $("#modalText").html(body);
    if (button1 === false) {
        modalButton1.style.display = 'none';
    } else {
        modalButton1.textContent = button1;
    }
    modalButton2.textContent = button2;
    modalButton2.classList.add(actionStyle);
    $("#modalButton1").on("click", () => {
        onCancel();
        modalCloseActions();
    });
    $("#modalButton2").on("click", () => {
        onAccept();
        modalCloseActions();
    });
    modalContainer.classList.add('shown');
}

const tooltip = document.getElementById('tooltip'),
      tooltipText = document.getElementById('tooltipText');
const newTooltip = (text) => {
    tooltipText.textContent = text;
    tooltip.classList.add('shown');
    setTimeout(() => tooltip.classList.remove('shown'), 1500);
}

const removeFromArray = (array, index) => {
    let value = array[index];
    let newArray = [...array].filter(item => item !== value);
    return newArray;
}

const removeWardrobeFromArray = (index) => {
    console.log(data.wardrobes[index]);
    let value = data.wardrobes[index].name;
    console.log("deleting wardrobe with name", value);
    data.wardrobes = data.wardrobes.filter(item => item.name !== value);
}

// home page part 1
const getClothesName = (arr1, arr2) => {
    if(arr2.length === 0) return "";
    return arr1[randFromArray(arr2)];
}
const generateOutfit = () => {
    let viableObjects = [...data.wardrobes].filter(obj => obj.enabled);
    if (viableObjects.length===0) {
        newModal(
            "Error",
            "Please activate some wardobes!",
            false,
            "OK",
            "normal",
            () => {},
            () => {}
        );
        $('#home-wardrobe-name').html(  "(no wardrobes available)"  );
        $('#home-layer').html(  ""  );
        $('#home-shirt').html(  ""  );
        $('#home-pants').html(  ""  );
        $('#home-shoes').html(  ""  );
        return;
    }
    let wardrobe = randFromArray(viableObjects);
    $('#home-wardrobe-name').html(wardrobe.name);
    $('#home-layer').html(  getClothesName(data.layers, wardrobe.layers)  );
    $('#home-shirt').html(  getClothesName(data.shirts, wardrobe.shirts)  );
    $('#home-pants').html(  getClothesName(data.pants, wardrobe.pants)  );
    $('#home-shoes').html(  getClothesName(data.shoes, wardrobe.shoes)  );
}

// handle localstorage
var data;
if(localStorage.getItem('data') === null) {
    console.log('registering new user...')
    let startingData = JSON.stringify({
        "layers": [], //["sample blue sweater", "sample black cardigan"],
        "shirts": [], //["sample white shirt", "sample black shirt"],
        "pants": [], //["sample light blue jeans", "sample tan khakis"],
        "shoes": [], //["sample tan crocs", "sample white sneakers"],
        "wardrobes": []
    });
    localStorage.setItem('data', startingData);
    data = JSON.parse(startingData);
    document.getElementById('home-page').classList.add('shown');
 /* document.getElementById('wardrobes-page').classList.add('shown');
    newModal(
        "Tutorial",
        `Start by creating your first wardrobe!
        There will be some sample clothing automatically added. Use this to learn the ropes.
        Once you're done, you can add your own clothes from the home screen. Enjoy!!`,
        false,
        "Begin",
        "normal",
        () => {},
        () => {}
    )*/
} else {
    data = JSON.parse(localStorage.getItem('data'));
    document.getElementById('home-page').classList.add('shown');
    generateOutfit();
}


// home page (part 2, part 1 above)
$("#home-shuffle-btn").on('click', generateOutfit)
//generateOutfit();

$("#home-manage-btn").on('click', () => {
    closeAll();
    document.getElementById('wardrobes-page').classList.add('shown');
    listPrep();
})

$("#home-clothes-btn").on('click', () => {
    closeAll();
    document.getElementById('clothes-page').classList.add('shown');
})

$("#home-settings").on('click', () => {
    closeAll();
    settingsPrep();
    document.getElementById('settings-page').classList.add('shown');
})

// wardrobe list page
const handleCheckbox = (index) => {
    data.wardrobes[index].enabled = !data.wardrobes[index].enabled;
    saveChanges();
}

const listPrep = () => {
    const domlist = document.getElementById('wardrobe-list');
    if(data.wardrobes.length === 0) {
        domlist.classList.add('placeholder');
        domlist.innerHTML = "Create a wardrobe to get started!";
        return;
    }
    domlist.classList.remove('placeholder');
    domlist.innerHTML = "";
    [...data.wardrobes].reverse().forEach((wardrobe, index) => {
        let e = document.createElement('div');
        e.classList.add('wardrobe');
        let modIndex = data.wardrobes.length-1-index;
        e.innerHTML = `
        <input type="checkbox" id="wardrobe-${modIndex}" ${wardrobe.enabled ? "checked" : ""} onClick="handleCheckbox(${modIndex})">
        <label for="wardrobe-${modIndex}">${wardrobe.name}</label>
        <button class="list-button edit" onClick="editWardrobe(${modIndex})"><i class="fa-solid fa-pencil"></i></button>
        <button class="list-button delete" onClick="deleteWardrobe(${modIndex})"><i class="fa-regular fa-trash-can"></i></button>
        `
        domlist.appendChild(e);
    })
}

var editingWardrobe = -1;

const editWardrobe = (index) => {
    editingWardrobe = index;
    closeAll();
    prepNewWardrobe();
    document.getElementById('create-page').classList.add('shown');
}

const deleteWardrobe = (index) => {
    // newModal(
    //     "Delete Wardrobe",
    //     `Are you sure you want to delete ${data.wardrobes[index].name}?`,
    //     "Cancel",
    //     "Delete",
    //     "danger",
    //     () => {},
    //     () => {
    //         //data.wardrobes.splice(index, 1);
    //         removeWardrobeFromArray(index);
    //         saveChanges();
    //         listPrep();
    //     }
    // )
    newTooltip(`Deleted ${data.wardrobes[index].name}`)
    removeWardrobeFromArray(index);
    saveChanges();
    listPrep();
    console.log("deleting", index)
}

listPrep();

$("#wardrobes-close").on('click', () => {
    closeAll();
    document.getElementById('home-page').classList.add('shown');
    generateOutfit();
})

$("#create-wardrobe-button").on('click', () => {
    if (
        data.layers.length === 0 &&
        data.shirts.length === 0 &&
        data.pants.length === 0 &&
        data.shoes.length === 0
    ) {
        newModal(
            "Error",
            "You must have at least one article of clothing in each category first! Go back home to add more clothes.",
            false,
            "OK",
            "normal",
            () => {},
            () => {}
        )
        return;
    }
    editingWardrobe = -1;
    closeAll();
    prepNewWardrobe();
    document.getElementById('create-page').classList.add('shown');
})

// create page

var newWardrobe = {};
var stage = 0;

const prepNewWardrobe = () => {
    stage = 0;
    if (editingWardrobe === -1) {
        newWardrobe = {
            "name": "",
            "enabled": true,
            "layers": [],
            "shirts": [],
            "pants": [],
            "shoes": []
        }
        document.getElementById("new-wardrobe-name").value = "";
    } else {
        newWardrobe = data.wardrobes[editingWardrobe];
        document.getElementById("new-wardrobe-name").value = newWardrobe.name;
    }
    document.getElementById('create-name-page').classList.add('shown');
    document.getElementById('add-clothes-page').classList.remove('shown');
    $("#new-name-error").html("");
    $("#create-next-button").html(`Next <i class="fa-solid fa-chevron-right"></i>`)
}

const fillList = (arr, target) => {
    document.getElementById("clothes-list").innerHTML = "";
    let editing = editingWardrobe !== -1;
    [...arr].reverse().forEach((cloth, index) => {
        let e = document.createElement('div');
        e.classList.add('clothesListItem');

        let modIndex = arr.length-1-index;

        let checked = false;
        if (newWardrobe[target].indexOf(modIndex) !== -1) checked = true;

        e.innerHTML = `
        <input type="checkbox" ${(checked) ? "checked" : ""} id="clothbox-${modIndex}" onClick="handleClothesCheckbox(this, ${modIndex}, '${target}')" />
        <label for="clothbox-${modIndex}">${cloth}</label>
        `

        document.getElementById("clothes-list").appendChild(e);
    })
}

const handleClothesCheckbox = (box, index, target) => {
    if(box.checked) {
        newWardrobe[target].push(index);
    } else {
        let indexToRemove = newWardrobe[target].indexOf(index);
        newWardrobe[target].splice(indexToRemove, 1);
    }
    console.log(newWardrobe[target])
}

const wardrobeNameInUse = (name) => {
    if(editingWardrobe !== -1 && name === data.wardrobes[editingWardrobe].name) return false;
    const filtered = [...data.wardrobes].filter(wardrobe => wardrobe.name === name);
    if (filtered.length !== 0) return true;
    return false;
}

const closeNewWardrobePage = () => {
    newWardrobe = {};
    closeAll();
    document.getElementById('wardrobes-page').classList.add('shown');
    listPrep();
}

const nextPage = () => {
    switch (stage) {
        case 0:
            let val = document.getElementById("new-wardrobe-name").value;
            if(val === "" ||
               val === null){
                $("#new-name-error").html("Please enter a name!")
                return;
            }
            if(wardrobeNameInUse(val)) {
                $("#new-name-error").html("Name already in use!")
                return;
            }
            newWardrobe.name = val;
            document.getElementById("create-name-page").classList.remove("shown");
            document.getElementById("add-clothes-page").classList.add("shown");
            $("#picking-category").html("layers");
            fillList(data.layers, "layers");
            stage++;
            break;
        case 1:
            $("#picking-category").html("shirts");
            fillList(data.shirts, "shirts");
            stage++;
            break;
        case 2:
            $("#picking-category").html("pants");
            fillList(data.pants, "pants");
            stage++;
            break;
        case 3:
            $("#picking-category").html("shoes");
            fillList(data.shoes, "shoes");
            $("#create-next-button").html(`<i class="fa-solid fa-check"></i> Done`)
            stage++;
            break;
        case 4:

            if (editingWardrobe !== -1) {
                data.wardrobes[editWardrobe] = newWardrobe
                newTooltip("Changes saved!")
            } else {
                data.wardrobes.push(newWardrobe);
                newTooltip("New wardrobe created and activated!")
            }

            saveChanges();
            closeNewWardrobePage();
            editingWardrobe = -1;
            
            break;
    }
}

$("#create-close").on('click', closeNewWardrobePage)

$("#create-next-button").on('click', nextPage)

// add clothes page
const addClothesBox = document.getElementById("add-clothes-box");
const addClothes = (arr) => {
    if (addClothesBox.value === "") {
        newTooltip("Please enter a name!");
        return;
    }
    if ([...arr].filter(item => item === addClothesBox.value).length !== 0) {
        newTooltip("Name already in use!");
        return;
    }
    arr.push(addClothesBox.value);
    saveChanges();
    let arrName;
    switch(arr) {
        case data.layers:
            arrName = "layers"
            break;
        case data.shirts:
            arrName = "shirts"
            break;
        case data.pants:
            arrName = "pants"
            break;
        case data.shoes:
            arrName = "shoes"
            break;
        default:
            arrName = "list"
            break;
    }
    newTooltip(`\"${addClothesBox.value}\" added to ${arrName}`)
    addClothesBox.value = "";
}

const clothesClose = () => {
    closeAll();
    document.getElementById('home-page').classList.add('shown');
}

$("#type-layers-button").on('click', () => { addClothes(data.layers) })
$("#type-shirts-button").on('click', () => { addClothes(data.shirts) })
$("#type-pants-button").on('click', () => { addClothes(data.pants) })
$("#type-shoes-button").on('click', () => { addClothes(data.shoes) })

$("#clothes-close").on('click', clothesClose);
$("#clothes-close-big").on('click', clothesClose);

// settings page

const settingsPrep = () => {
    saveChanges();
    let newString = "";
    newString+=`<b>Your Data</b><br />--- Wardrobes ---<br />`;
    data.wardrobes.forEach(wardrobe => newString+=`${wardrobe.name}<br />`);
    newString+=`<br />--- Layers ---<br />`;
    data.layers.forEach(layer => newString+=`${layer}<br />`);
    newString+=`<br />--- Shirts ---<br />`;
    data.shirts.forEach(shirt => newString+=`${shirt}<br />`);
    newString+=`<br />--- Pants ---<br />`;
    data.pants.forEach(pants => newString+=`${pants}<br />`);
    newString+=`<br />--- Shoes ---<br />`;
    data.shoes.forEach(pair => newString+=`${pair}<br />`);
    $("#settings-info").html(newString);
}

const resetData = () => {
    newModal(
        "Reset All Data",
        "Are you sure you want to reset all data? This will irreversably delete everything!",
        "Cancel",
        "Delete",
        "danger",
        () => {},
        () => {
            saveChanges();
            localStorage.removeItem("data");
            localStorage.clear();
            location.reload();
        }
    )
}

const exportData = () => {
    saveChanges();
    const textToCopy = localStorage.getItem("data");

    const clipboardItem = new ClipboardItem({ 'text/plain': new Blob([textToCopy], { type: 'text/plain' }) });

    navigator.clipboard.write([clipboardItem])
        .then(function() {
            newTooltip("Copied data to clipboard.")
        })
        .catch(function(err) {
            newTooltip("Unable to export!")
        });
}

$("#reset-data-button").on('click', resetData);
$("#export-data-button").on('click', exportData);

$("#settings-close").on('click', () => {
    closeAll();
    document.getElementById('home-page').classList.add('shown');
});