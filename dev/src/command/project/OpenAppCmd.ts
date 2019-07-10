/*******************************************************************************
 * Copyright (c) 2018, 2019 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/

import * as vscode from "vscode";

import Project from "../../microclimate/project/Project";
import { promptForProject } from "../CommandUtil";
import { ProjectState } from "../../microclimate/project/ProjectState";
import { Log } from "../../Logger";
import Commands from "../../constants/Commands";
import Translator from "../../constants/strings/translator";
import StringNamespaces from "../../constants/strings/StringNamespaces";

const STRING_NS = StringNamespaces.CMD_OPEN_IN_BROWSER;

export default async function openAppCmd(project: Project): Promise<void> {
    if (project == null) {
        const selected = await promptForProject(...ProjectState.getStartedStates());
        if (selected == null) {
            Log.d("User cancelled prompt for resource");
            // user cancelled
            return;
        }
        project = selected;
    }

    if (!(project.state.isStarted || project.state.isStarting)) {
        vscode.window.showWarningMessage(Translator.t(STRING_NS, "canOnlyOpenStartedProjects", { projectName: project.name }));
        return;
    }
    else if (project.appBaseUrl == null) {
        Log.e("Project is started but has no appBaseUrl: " + project.name);
        vscode.window.showErrorMessage(Translator.t(STRING_NS, "failedDetermineAppUrl", { projectName: project.name }));
        return;
    }

    const uriToOpen = project.appBaseUrl;

    Log.i("Open in browser: " + uriToOpen);
    // vscode.window.showInformationMessage("Opening " + uriToOpen);
    vscode.commands.executeCommand(Commands.VSC_OPEN, uriToOpen);
}