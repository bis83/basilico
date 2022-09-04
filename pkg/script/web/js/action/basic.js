
define_action("nextview", (self, view) => {
    view_next(view);
});

define_action("resetview", (self) => {
    view_reset();
});

define_action("newgame", (self, slot) => {
    $view.slot = slot;
    newgame();
});

define_action("loadgame", (self, slot) => {
    $view.slot = slot;
    loadgame();
});

define_action("savegame", (self) => {
    savegame();
});
