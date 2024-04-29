// Code to generate checklist and download the file

export function grade(down = false, id = false) {
    let i = 1;
    let check = document.getElementById("c" + i);
    let title = "Wisc ID: " + document.getElementById("name").value;
    title += "\nGitHub ID: " + document.getElementById("git").value;
    let output = "";
    let grade = 0;
    while (check) {
        output += "[" + (check.checked ? "X" : " ") + "]";
        output += " " + document.getElementById("l" + i).innerHTML;
        output += ": " + document.getElementById("t" + i).value.split("\n").join(" ; ");
        output += "\n";
        grade += check.checked ? Number(check.value) : 0;
        i++;
        check = document.getElementById("c" + i);
    }
    title += "\n" + "Points = " + grade;
    title += "\n" + "Grade = " + Math.min(5, (Math.ceil(grade / 10) / 2).toFixed(1)) + " out of 5";
    document.getElementById("area").value = title + "\n\n" + output;
    if (down) download(id);
}

export function copy() {
    let field = document.getElementById("area");
    field.select();
    navigator.clipboard.writeText(field.value);
}

export function download(id = false) {
    let text = document.getElementById("area").value;
    if (text.trim() == "") grade(true, id);
    else {
        let blob = new Blob([text], { type: "text/plain" });
        let link = document.createElement("a");
        let file = document.getElementById("workbook").innerHTML;
        if (id) file = document.getElementById("git").value + "-" + file;
        link.download = file;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function grader() {
    download(true);
}

export function load() {
    let file = window.XMLHttpRequest ? new XMLHttpRequest() : null;
    if (file) {
        file.open("GET", document.getElementById("workbook").innerHTML);
        file.send(null);
        file.onreadystatechange = function () {
            if (file.readyState == 4 && file.status == 200) {
                let text = file.responseText.trim().split("\n");
                let i = 0;
                let check, field;
                for (let line of text) {
                    if (line.trim().startsWith("[")) {
                        i++;
                        check = document.getElementById("c" + i);
                        field = document.getElementById("t" + i);
                        if (check && field) {
                            if (line.trim().toLowerCase().startsWith("[x]")) check.checked = true;
                            field.value = line.substring(line.indexOf("]:") + 2).trim().replace(" ; ", "\n").replace("`", "'");
                            field.rows = String(Math.ceil(field.value.length / 20 + 1));
                        }
                    }
                    else if (line.trim().toLowerCase().startsWith("wisc")) document.getElementById("name").value = line.substring(line.indexOf(":") + 1).trim();
                    else if (line.trim().toLowerCase().startsWith("git")) document.getElementById("git").value = line.substring(line.indexOf(":") + 1).trim();
                }
            }
        }
    }
}