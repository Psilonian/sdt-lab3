// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit from 'simple-git';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
  const disposable = vscode.commands.registerCommand(
    'sdt-lab3.createDeadlineBranch',
    async () => {
      try {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (!folder) {
          vscode.window.showErrorMessage('Open a folder (git repo) first.');
          return;
        }

        const repoPath = folder.uri.fsPath;
        const git = simpleGit({ baseDir: repoPath });

        const isRepo = await git.checkIsRepo();
        if (!isRepo) {
          vscode.window.showErrorMessage('This folder is not a Git repository.');
          return;
        }

        const branchName = 'deadline_0';
        const branches = await git.branchLocal();

        if (branches.all.includes(branchName)) {
          await git.checkout(branchName);
          vscode.window.showInformationMessage(`Checked out '${branchName}'.`);
        } else {
          await git.checkoutLocalBranch(branchName);
          vscode.window.showInformationMessage(`Created and checked out '${branchName}'.`);
        }
      } catch (err: any) {
        vscode.window.showErrorMessage(`Git error: ${err?.message ?? String(err)}`);
      }
    }
  );

  context.subscriptions.push(disposable);
	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

}

// This method is called when your extension is deactivated
export function deactivate() {}
