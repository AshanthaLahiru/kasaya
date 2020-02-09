#! /usr/bin/env node

const Jarvis = require('jarvis'); // wrapped by jarvis
const { argv } = require('yargs');
const messageEmitter = require('./src/utils/messageEmitter');
const Terminal = require('./src/utils/terminal');
const seleniumStart = require('./presets/seleniumStart');

const launch = require('./src/core/actions/launch');
const open = require('./src/core/actions/open');
const go = require('./src/core/actions/go');
const type = require('./src/core/actions/type');
const refresh = require('./src/core/actions/refresh');
const acceptAlert = require('./src/core/actions/acceptAlert');
const dismissAlert = require('./src/core/actions/dismissAlert');
const read = require('./src/core/actions/read');
const readInput = require('./src/core/actions/readInput');
const readUrl = require('./src/core/actions/readUrl');
const readTitle = require('./src/core/actions/readTitle');
const readAlert = require('./src/core/actions/readAlert');
const print = require('./src/core/actions/print');
const press = require('./src/core/actions/press');
const clear = require('./src/core/actions/clear');
const close = require('./src/core/actions/close');
const highlight = require('./src/core/actions/highlight');
const assert = require('./src/core/actions/assert');
const set = require('./src/core/actions/set');
const click = require('./src/core/actions/mouseActions');
const switchTo = require('./src/core/actions/switchTo');
const inspect = require('./src/core/actions/inspect');
const exit = require('./src/core/actions/exit');
const wait = require('./src/core/actions/wait');
const createRequest = require('./src/core/actions/createRequest');
const evaluate = require('./src/core/actions/evaluate');
const testRunner = require('./src/utils/testRunner');
const drag = require('./src/core/actions/drag');
const { MODES, TEST } = require('./src/constants');
const coverageReporter = require('./src/core/helpers/coverageReporter');
const snapshot = require('./src/core/actions/snapshot');
const execute = require('./src/core/actions/execute');
const help = require('./src/core/actions/help');

const app = new Jarvis();

const state = {}; // Mutable state to store 'browser'

app.addCommand({
  command: 'launch $browserName',
  handler: launch.bind(null, state),
});
app.addCommand({
  command: 'open $url',
  help: 'open "google.com" - Navigates to google.com in the current browser window',
  handler: open.bind(null, state, { isNewTab: false }),
});
app.addCommand({
  command: 'open $url in new window',
  help: 'open "google.com" in new window - Navigates to google.com in a new browser window',
  handler: open.bind(null, state, { isNewTab: true }),
});
app.addCommand({
  command: 'go $direction',
  help: 'go back - Same as hitting the browser back button',
  handler: go.bind(null, state),
});
app.addCommand({
  command: 'type $typeText',
  help: 'type "cat" - Types "cat" on currently active field',
  handler: type.bind(null, state),
});
app.addCommand({
  command: 'refresh',
  help: 'refresh - Refreshes the current tab',
  handler: refresh.bind(null, state),
});
app.addCommand({
  command: 'accept alert',
  help: 'accept alert - Accepts browser alerts',
  handler: acceptAlert.bind(null, state),
});
app.addCommand({
  command: 'dismiss alert',
  help: 'dismiss alert - Dismisses browser alerts',
  handler: dismissAlert.bind(null, state),
});
app.addCommand({
  command: 'drag $source to $destination',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source to $destination $destinationIndex',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source to $destination near $destinationMarker',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source $sourceIndex to $destination',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source $sourceIndex to $destination $destinationIndex',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source $sourceIndex to $destination near $destinationMarker',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source near $sourceMarker to $destination',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source near $sourceMarker to $destination $destinationIndex',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'drag $source near $sourceMarker to $destination near $destinationMarker',
  handler: drag.bind(null, state),
});
app.addCommand({
  command: 'read $searchText',
  help: 'read "John is ${age} years old" - Extracts age to a variable',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from url',
  aliases: [],
  help: 'read "https://www.facebook.com/${profile}" from url - Extracts profile name to a variable from a given url',
  handler: readUrl.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from alert',
  aliases: [],
  help: 'read "Leave this site without ${action} from alert - Extracts content from browser alert and saves to a variable',
  handler: readAlert.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from $identifier',
  aliases: [],
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText $index',
  aliases: [],
  help: 'read "checkout ${product}" 0 - Extracts the product name of the first item with matching pattern',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText near $marker',
  aliases: [],
  help: 'read "John is ${age} years old" near "biography" - Specify a match to read near to a target in case of multiple matches',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from page title',
  aliases: [],
  help: 'read "Facebook ${title}" from page title - Extracts "Login" as page title',
  handler: readTitle.bind(null, state),
});
app.addCommand({
  command: 'read $searchText to the $direction of $marker',
  aliases: [],
  help: 'read "${ratings}" to the "right" of "IMDb" - Extracts rating to the right of text "IMDb"',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row column $column',
  aliases: ['lookup $column for $row as $searchText'],
  help: 'read ${employeeNo} from row "John" column "Employee No" - Extracts "Employee No" of "John" in a table',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row column $column $index',
  aliases: ['lookup $column for $row as $searchText $index'],
  help: '',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command:
    'read $searchText from row $row near $rowMarker column $column near $columnMarker $index',
  aliases: ['lookup $column near $columnMarker for $row near $rowMarker as $searchText $index'],
  help: '',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row near $rowMarker column $column $index',
  aliases: ['lookup $column for $row near $rowMarker as $searchText $index'],
  help: '',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row column $column near $columnMarker $index',
  aliases: ['lookup $column near $columnMarker for $row as $searchText $index'],
  help: '',
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row near $rowMarker column $column near $columnMarker',
  aliases: ['lookup $column near $columnMarker for $row near $rowMarker as $searchText'],
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row near $rowMarker column $column',
  aliases: ['lookup $column for $row near $rowMarker as $searchText'],
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read $searchText from row $row column $column near $columnMarker',
  aliases: ['lookup $column near $columnMarker for $row as $searchText'],
  handler: read.readByTemplate.bind(null, state),
});
app.addCommand({
  command: 'read value from $selector field as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isTextField: true }),
});
app.addCommand({
  command: 'read value from $selector field near $marker as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isTextField: true }),
});
app.addCommand({
  command: 'read value from $selector field $elementIndex as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isTextField: true }),
});
app.addCommand({
  command: 'read $selector state as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isSelector: true }),
});
app.addCommand({
  command: 'read $selector state near $marker as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isSelector: true }),
});
app.addCommand({
  command: 'read $selector state $elementIndex as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isSelector: true }),
});
app.addCommand({
  command: 'read active field as $destinationVar',
  aliases: [],
  handler: readInput.activeRead.bind(null, state),
});
app.addCommand({
  command: 'read placeholder from $selector field as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isPlaceholder: true }),
});
app.addCommand({
  command: 'read placeholder from $selector $elementIndex field as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isPlaceholder: true }),
});
app.addCommand({
  command: 'read placeholder from $selector near $marker field as $destinationVar',
  aliases: [],
  handler: readInput.selectiveRead.bind(null, state, { isPlaceholder: true }),
});
app.addCommand({
  command: 'print $variable',
  aliases: [],
  help: 'print "Hello" - Prints a given value',
  handler: print,
});
app.addCommand({
  command: 'press $inputKeys',
  help: 'press "enter" - Issues key strokes such as "enter", "tab", "shift", "delete"',
  handler: press.bind(null, state),
});
app.addCommand({
  command: 'clear $what',
  help: 'clear "text" - Clears text of currently active field',
  handler: clear.bind(null, state),
});
app.addCommand({
  command: 'close $what',
  help: 'close "window" - Closes currently open browser window',
  handler: close.bind(null, state),
});
app.addCommand({
  command: 'highlight $selector',
  help: 'highlight "John" - Highlights an element with a border',
  handler: highlight.bind(null, state),
});
app.addCommand({
  command: 'highlight $selector $elementIndex',
  handler: highlight.bind(null, state),
});
app.addCommand({
  command: 'highlight $selector near $marker',
  handler: highlight.bind(null, state),
});
app.addCommand({
  command: 'highlight $selector $elementIndex near $marker',
  handler: highlight.bind(null, state),
});
app.addCommand({
  command: 'check if $selector contains $expectedVal',
  handler: assert.checkElementStatus.bind(null, state, { isTextField: true }),
});
app.addCommand({
  command: 'check if $selector near $marker contains $expectedVal',
  handler: assert.checkElementStatus.bind(null, state, { isTextField: true }),
});
app.addCommand({
  command: 'check if $selector $elementIndex contains $expectedVal',
  handler: assert.checkElementStatus.bind(null, state, { isTextField: true }),
});
app.addCommand({
  command: 'check if $selector is checked',
  help: 'check if "checkbox" is checked - Checks whether an input element is checked',
  handler: assert.checkElementStatus.bind(null, state, { isSelector: true }),
});
app.addCommand({
  command: 'check if $selector near $marker is checked',
  handler: assert.checkElementStatus.bind(null, state, { isSelector: true }),
});
app.addCommand({
  command: 'check if $selector $elementIndex is checked',
  handler: assert.checkElementStatus.bind(null, state, { isSelector: true }),
});
app.addCommand({
  command: 'check if $selector is not checked',
  handler: assert.checkElementStatus.bind(null, state, { isSelector: false }),
});
app.addCommand({
  command: 'check if $selector near $marker is not checked',
  handler: assert.checkElementStatus.bind(null, state, { isSelector: false }),
});
app.addCommand({
  command: 'check if $selector $elementIndex is not checked',
  handler: assert.checkElementStatus.bind(null, state, { isSelector: false }),
});
app.addCommand({
  command: 'check if $selector is enabled',
  help: 'check if "Login" is enabled - Checks whether the "Login" button is clickable',
  handler: assert.checkElementStatus.bind(null, state, { isEnabled: true }),
});
app.addCommand({
  command: 'check if $selector $elementIndex is enabled',
  handler: assert.checkElementStatus.bind(null, state, { isEnabled: true }),
});
app.addCommand({
  command: 'check if $selector near $marker is enabled',
  handler: assert.checkElementStatus.bind(null, state, { isEnabled: true }),
});
app.addCommand({
  command: 'check if $selector is disabled',
  handler: assert.checkElementStatus.bind(null, state, { isEnabled: false }),
});
app.addCommand({
  command: 'check if $selector $elementIndex is disabled',
  handler: assert.checkElementStatus.bind(null, state, { isEnabled: false }),
});
app.addCommand({
  command: 'check if $selector near $marker is disabled',
  handler: assert.checkElementStatus.bind(null, state, { isEnabled: false }),
});
app.addCommand({
  command: 'check if $selector is focused',
  handler: assert.checkElementStatus.bind(null, state, { isFocused: true }),
});
app.addCommand({
  command: 'check if $selector near $marker is focused',
  handler: assert.checkElementStatus.bind(null, state, { isFocused: true }),
});
app.addCommand({
  command: 'check if $selector $elementIndex is focused',
  handler: assert.checkElementStatus.bind(null, state, { isFocused: true }),
});
app.addCommand({
  command: 'check if $selector is not focused',
  handler: assert.checkElementStatus.bind(null, state, { isFocused: false }),
});
app.addCommand({
  command: 'check if $selector near $marker is not focused',
  handler: assert.checkElementStatus.bind(null, state, { isFocused: false }),
});
app.addCommand({
  command: 'check if $selector $elementIndex is not focused',
  handler: assert.checkElementStatus.bind(null, state, { isFocused: false }),
});
app.addCommand({
  command: 'check if $selector is available',
  help: 'check if "Out of Stock" is available - Checks if "Out of Stock" is within current window',
  handler: assert.checkElementAvailability.bind(null, state, { isAvailable: true }),
});
app.addCommand({
  command: 'check if $selector is not available',
  help: 'check if "Out of Stock" is not available - Checks if "Out of Stock" is not displayed within current window',
  handler: assert.checkElementAvailability.bind(null, state, { isAvailable: false }),
});
app.addCommand({
  command: 'check if $actualVal is $expectedVal',
  help: 'check if $age is "25" - Checks whether a given value is equal to a previously saved value',
  handler: assert.common,
});
app.addCommand({
  command: 'check if $actualVal is not $notExpectedVal',
  help: 'check if $age is not "25" - Checks whether a given value is not equal to a previously saved value',
  handler: assert.common,
});
app.addCommand({
  command: 'copy $sourceVar to $destinationVar',
  handler: set.copyValue,
});
app.addCommand({
  command: 'set $storeVar to $value',
  handler: set.setValue,
});
app.addCommand({
  command: 'inspect',
  handler: inspect.bind(null, state),
});
app.addCommand({
  command: 'switch $what',
  handler: switchTo.bind(null, state),
});
app.addCommand({
  command: 'click $selector',
  help: 'click "Login" - Clicks on "Login" button',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click $selector $elementIndex',
  help: 'click "Purchase" 0 - Clicks on the first occurrence of "Purchase" button as specified with index "0" in case of multiple matches',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click $selector near $marker',
  help: 'click "Purchase" near "Shoes" - Clicks on "Purchase" button near "Shoes" text in case of multiple matches for "Purchase"',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click $selector $elementIndex near $marker',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row column $column',
  help: 'click on row "John" column "Employee No" - Clicks on cell with "Employee No" of "John" in a table',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row near $rowMarker column $column near $columnMarker',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row near $rowMarker column $column near $columnMarker $elementIndex',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row near $rowMarker column $column',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row near $rowMarker column $column $elementIndex',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row column $column near $columnMarker',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row column $column near $columnMarker $elementIndex',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'click on row $row column $column $elementIndex',
  handler: click.bind(null, state, { click: true }),
});
app.addCommand({
  command: 'double click $selector',
  handler: click.bind(null, state, { doubleClick: true }),
});
app.addCommand({
  command: 'double click $selector $elementIndex',
  handler: click.bind(null, state, { doubleClick: true }),
});
app.addCommand({
  command: 'double click $selector near $marker',
  handler: click.bind(null, state, { doubleClick: true }),
});
app.addCommand({
  command: 'double click $selector $elementIndex near $marker',
  handler: click.bind(null, state, { doubleClick: true }),
});
app.addCommand({
  command: 'hover $selector',
  help: 'hover "Notifications" - Hovers over "Notifications" icon',
  handler: click.bind(null, state, { hover: true }),
});
app.addCommand({
  command: 'hover $selector $elementIndex',
  help: 'hover "chat icon" 0 - Hovers over the first "chat icon" as specified with index "0" in case of multiple chat icons',
  handler: click.bind(null, state, { hover: true }),
});
app.addCommand({
  command: 'hover $selector near $marker',
  help: 'hover "chat icon" near "John Doe" - Hovers over "chat icon" near text "John Doe" in case of multiple chat icons',
  handler: click.bind(null, state, { hover: true }),
});
app.addCommand({
  command: 'hover $selector $elementIndex near $marker',
  handler: click.bind(null, state, { hover: true }),
});
app.addCommand({
  command: 'hover on row $row column $column',
  handler: click.bind(null, state, { hover: true }),
});
app.addCommand({
  command: 'hover on row $row column $column $elementIndex',
  handler: click.bind(null, state, { hover: true }),
});
app.addCommand({
  command: 'right click $selector',
  handler: click.bind(null, state, { rightClick: true }),
});
app.addCommand({
  command: 'right click $selector $elementIndex',
  handler: click.bind(null, state, { rightClick: true }),
});
app.addCommand({
  command: 'right click $selector near $marker',
  handler: click.bind(null, state, { rightClick: true }),
});
app.addCommand({
  command: 'right click $selector $elementIndex near $marker',
  handler: click.bind(null, state, { rightClick: true }),
});
app.addCommand({
  command: 'middle click $selector',
  handler: click.bind(null, state, { middleClick: true }),
});
app.addCommand({
  command: 'middle click $selector $elementIndex',
  handler: click.bind(null, state, { middleClick: true }),
});
app.addCommand({
  command: 'middle click $selector near $marker',
  handler: click.bind(null, state, { middleClick: true }),
});
app.addCommand({
  command: 'middle click $selector $elementIndex near $marker',
  handler: click.bind(null, state, { middleClick: true }),
});
app.addCommand({
  command: 'wait $time seconds',
  help: 'wait "5" seconds - Waits for "5" seconds before issuing next command',
  handler: wait.bind(null, state),
});
app.addCommand({
  command: 'wait $time seconds for $selector',
  handler: wait.bind(null, state),
});
app.addCommand({
  command: 'wait $time seconds for $selector near $marker',
  handler: wait.bind(null, state),
});
app.addCommand({
  command: 'http $method $url as $varName',
  handler: createRequest,
});
app.addCommand({
  command: 'evaluate $expression as $varName',
  handler: evaluate,
});
app.addCommand({
  command: 'save browser state as $snapshotReference',
  handler: snapshot.bind(null, state, { mode: 'get' }),
});
app.addCommand({
  command: 'load browser state $snapshotReference',
  handler: snapshot.bind(null, state, { mode: 'set' }),
});
app.addCommand({
  command: 'execute browser function $functionIdentifier with string $argumentString',
  handler: execute.bind(null, state),
});
app.addCommand({
  command: 'execute browser function $functionIdentifier',
  aliases: [
    'execute browser function $functionIdentifier with $argument1',
    'execute browser function $functionIdentifier with $argument1 $argument2',
    'execute browser function $functionIdentifier with $argument1 $argument2 $argument3'],
  handler: execute.bind(null, state),
});
app.addCommand({
  command: 'help',
  aliases: ['help $parentCommand'],
  handler: help,
});
app.addCommand({
  command: 'exit',
  aliases: ['quit', 'q'],
  help: 'exit - Exits `Kasāya` prompt',
  handler: exit.bind(null, state),
});

app.on('command', async ({ command, response }) => {
  const mode = Terminal.getMode();
  const status = testRunner.evaluateTest(response);
  const { coverage } = argv;

  if (status) {
    if (mode === MODES.TEST) {
      /**
       * Log the status of test cases
       * If a response contains assertion validation it considers as a test
       */
      testRunner.emitTestLog({ command, status });
      if (state.testCases) {
        state.testCases.push(status);
      } else {
        state.testCases = [status];
      }
    } else if (mode === MODES.TEST_STRICT) {
      /**
       * Terminate the process with non-zero return value in strict mode
       * Used in CI/CD pipelines
       */
      testRunner.emitTestLog({ command, status });
      if (status === TEST.FAIL) {
        process.exit(-1);
      }
    } else if (mode === MODES.VERBOSE) {
      /**
       * Display all the logs in run-time
       */
      testRunner.emitVerboseLog({ command, status });
    }
    if (coverage) {
      await coverageReporter.fetchCoverage(state);
    }
  }
});

const catchUnhandledError = () => {
  messageEmitter.emitError('Something went wrong :(, would you like to try again! :)');
  Terminal.prompt();
};

process.on('uncaughtException', catchUnhandledError);
process.on('unhandledRejection', catchUnhandledError);

(async () => {
  await seleniumStart();
  const script = process.argv[2];
  const {
    mode, extension, headless, env,
  } = argv;

  let activeMode;
  if (script && !mode) {
    activeMode = MODES.VERBOSE;
  } else if (script && mode) {
    activeMode = mode;
  } else {
    activeMode = MODES.REPL;
  }

  Terminal.setMode(activeMode);
  await launch(state, { args: { browserName: 'chrome', extension, isHeadless: headless } });
  let res;
  try {
    res = await app.addScriptMode('kasaya', process.argv[2], env);
  } catch (error) {
    messageEmitter.emitError('Could not execute script!');
    process.exit(0);
  }

  if (res) {
    if (mode === MODES.TEST) {
      testRunner.emitTestSummary(state.testCases);
    }
    process.exit(0);
  } else {
    Terminal.init(app);
    Terminal.listen();
  }
})();
