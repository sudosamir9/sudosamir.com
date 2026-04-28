---
title: "Shell Shortcuts to Save You 0.01 Seconds (Each)"
date: 2026-04-28
draft: false
---

You spend most of your day in the terminal. You also spend a non-trivial portion of it hammering the up-arrow forty times to find that one command from yesterday. Here's how to fix at least some of that.

Each of these will save you roughly **0.01 seconds per use**. Multiply that by the 12,000 commands you'll run this year and you've earned yourself an extra coffee break. Maybe.

## `Ctrl + R` — Time travel through your history

Press `Ctrl+R`, start typing, and the shell searches your history backward, fuzzy-style. Hit `Ctrl+R` again to keep going further back.

{{< terminal >}}<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> <span style="color:#888">^R</span>
(reverse-i-search)`ssh': ssh root@10.0.0.42{{< /terminal >}}

This is the single most life-changing shortcut on the list. If you remember nothing else, remember this one.

## `!!` — Just do that again

Forgot `sudo`? Type `sudo !!`. The shell expands `!!` to your previous command:

{{< terminal >}}<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> dnf install vim
<span class="rh-out-err">Error: This command has to be run with superuser privileges.</span>
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> sudo !!
sudo dnf install vim{{< /terminal >}}

It's the ergonomic equivalent of a sigh.

## `!$` — The last word

`!$` expands to the last argument of your previous command. Useful when you just typed a long path and want to do one more thing to it:

{{< terminal >}}<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> ls /var/log/very/deep/path/server.log
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> tail -f !$
tail -f /var/log/very/deep/path/server.log{{< /terminal >}}

`Alt + .` does the same thing, in case your `!` key is feeling fragile.

## `Ctrl + A` and `Ctrl + E` — Teleportation

`Ctrl + A` jumps to the start of the line. `Ctrl + E` jumps to the end.

You'll mostly use these to add `sudo` to a command you forgot to add it to. Or you could just type `sudo !!` (see above). Welcome to the abundance of options.

## `Ctrl + U` — The "I never did that" combo

`Ctrl + U` deletes everything from the cursor back to the start of the line. Pasted your password into the wrong window? `Ctrl + U`. Done. As if it never happened.

*(It kind of did happen. Also run `history -d $((HISTCMD-1))` before anyone notices.)*

## `Ctrl + W` — Backspace, but bigger

`Ctrl + W` deletes the word behind the cursor in one keystroke. Like backspace, except it actually finishes the job before you retire.

Useful when you typed `cd /etc/sysconfig/networrk-scripts`, hit Tab, and got nothing back.

## `Ctrl + L` — Clear without losing your soul

The `clear` command works. So does waiting ten seconds for your scrollback to scroll. `Ctrl + L` clears the screen instantly. No drama, no waiting.

## `Ctrl + Z` and `fg` — Pause that, I have other plans

You're inside `vim` and someone needs you to check `df -h` *right now*. `Ctrl + Z` suspends vim. Type `fg` when you're ready to come back. Vim has been waiting patiently the whole time. (As have your unsaved changes.)

{{< terminal >}}<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> vim /etc/nginx/nginx.conf
<span style="color:#888">^Z</span>
[1]+  Stopped     vim /etc/nginx/nginx.conf
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> df -h
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/rhel-root     50G   18G   33G  35% /
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> fg
vim /etc/nginx/nginx.conf{{< /terminal >}}

## `^typo^fix` — Spellcheck for the shell

Just typed `sl` instead of `ls`? Type `^sl^ls` and the shell reruns the previous command with the substitution. Stop retyping the rest of it.

{{< terminal >}}<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> sl -la /etc/passwd
<span class="rh-out-err">bash: sl: command not found...</span>
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> ^sl^ls
ls -la /etc/passwd
-rw-r--r--. 1 root root 2447 Apr 28 09:41 /etc/passwd{{< /terminal >}}

## `cd -` — The undo button for directories

`cd -` takes you back to the previous directory you were in:

{{< terminal >}}<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> pwd
/home/samir
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> ~]$</span> cd /etc/nginx
<span class="rh-prompt">[<span class="rh-prompt-host">samir@rhel</span> /etc/nginx]$</span> cd -
/home/samir{{< /terminal >}}

Toggle back and forth between two directories forever. It's not as clever as `pushd`/`popd`, but you won't remember `pushd`/`popd` exists when you actually need it.

---

That's ten. You now type slightly faster than the rest of the office. Don't forget to mention this in your next salary review.

— Mr. Sudo 🐧
