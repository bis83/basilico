
$action["nextview"] = (view) => {
    const i = data_view_index(view);
    if(i < 0) {
        return;
    }
    $temp.view = i;
};

$action["newgame"] = (slot) => {
    $temp.slot = slot;
    newgame();
};

$action["loadgame"] = (slot) => {
    $temp.slot = slot;
    loadgame();
};

$action["savegame"] = () => {
    savegame();
};

$action["resetgame"] = () => {
    $temp.slot = null;
    $temp.view = null;
};
