import { commands, window, Location, Uri, Range, Position } from "vscode";
import { type Location as LSLocation } from "vscode-languageclient/node";

/**
 * converts locations of type vscode-languageclient/node to `Location` from `vscode` (client) extension
 *
 * @param {LSLocation} locations - code locations
 * @returns {Location}
 */
function castLocationsType({ uri, range }: LSLocation) {
  return new Location(
    Uri.file(uri),
    new Range(new Position(range.start.line, range.start.character), new Position(range.end.line, range.end.character)),
  );
}

// trigger vscode build-in command to navigate to the given code location(s)
export function goToLocation(location: LSLocation) {
  commands.executeCommand(
    "editor.action.goToLocations",
    window.activeTextEditor.document.uri, // from
    window.activeTextEditor.selection.active,
    [castLocationsType(location)], // to
    "peek", // for multiple options (if we use LSLocation[]), show the list and allow the user to choose
    "",
  );
}
