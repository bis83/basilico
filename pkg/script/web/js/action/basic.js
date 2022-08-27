
define_action("nextview", (view) => {
    view_next(view);
});

define_action("resetview", () => {
    view_reset();
});

define_action("newgame", (slot) => {
    $view.slot = slot;
    newgame();
});

define_action("loadgame", (slot) => {
    $view.slot = slot;
    loadgame();
});

define_action("savegame", () => {
    savegame();
});
