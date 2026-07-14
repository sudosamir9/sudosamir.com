---
title: "RHCSA EX200"
date: 2026-04-28
---

<div class="rhcsa-banner">
  <div class="rhcsa-tag">CERTIFICATION TRACK</div>
  <h1 class="rhcsa-title">RHCSA EX200</h1>
  <p class="rhcsa-sub">Red Hat Certified System Administrator &middot; RHEL 9</p>
  <div class="rhcsa-meta">
    <span><strong>Duration:</strong> 16 weeks</span>
    <span><strong>Sessions:</strong> 33</span>
    <span><strong>Audience:</strong> Beginners &rarr; Linux sysadmin / cybersecurity</span>
  </div>
</div>

<style>
  .rhcsa-banner {
    background: linear-gradient(135deg, #ee0000 0%, #b30000 100%);
    color: #fff;
    padding: 36px 28px;
    margin: 0 0 30px 0;
    border-radius: 2px;
    box-shadow: 0 6px 24px rgba(238, 0, 0, 0.25);
    border-left: 6px solid #fff;
  }
  .rhcsa-tag {
    font-size: 0.75em;
    letter-spacing: 3px;
    font-weight: 700;
    opacity: 0.85;
    margin-bottom: 6px;
  }
  .rhcsa-title {
    margin: 0 !important;
    color: #fff !important;
    font-size: 2.4em !important;
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1.1;
  }
  .rhcsa-sub {
    margin: 8px 0 18px 0 !important;
    color: #fff !important;
    opacity: 0.95;
    font-size: 1.05em;
  }
  .rhcsa-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    font-size: 0.92em;
    border-top: 1px solid rgba(255,255,255,0.25);
    padding-top: 14px;
  }
  .rhcsa-meta span { color: #fff; opacity: 0.9; }
  .rhcsa-meta strong { font-weight: 700; opacity: 1; }

  .rhcsa-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    margin: 0;
  }
  .rhcsa-card {
    display: block;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 3px solid #ee0000;
    padding: 16px 18px;
    border-radius: 2px;
    text-decoration: none !important;
    color: inherit !important;
    transition: all 0.15s ease;
  }
  .rhcsa-card:hover {
    background: rgba(126, 218, 40, 0.05);
    border-color: rgba(126, 218, 40, 0.4);
    border-left-color: #ee0000;
    transform: translateX(3px);
  }
  .rhcsa-card-title {
    display: block;
    font-weight: 700;
    color: var(--accent);
    font-size: 1em;
    margin-bottom: 6px;
  }
  .rhcsa-card-desc {
    display: block;
    font-size: 0.88em;
    opacity: 0.82;
    line-height: 1.5;
  }
  .rhcsa-card-review {
    border-left-color: #ee0000;
    background: rgba(238, 0, 0, 0.06);
  }
  .rhcsa-card-review .rhcsa-card-title::before {
    content: "★  ";
    color: #ee0000;
  }
</style>

<div class="rhcsa-cards">
  <a href="/rhcsa/session-01-introduction/" class="rhcsa-card">
    <span class="rhcsa-card-title">Introduction & Lab Environment</span>
    <span class="rhcsa-card-desc">Course overview, RHEL 9 install in a VM, and getting oriented at the first prompt.</span>
  </a>
  <a href="/rhcsa/session-02-shell-essentials/" class="rhcsa-card">
    <span class="rhcsa-card-title">The Shell & Command-Line Essentials</span>
    <span class="rhcsa-card-desc">pwd, ls, cd, man pages, tab completion, history — the muscle memory you'll use every session.</span>
  </a>
  <a href="/rhcsa/session-03-files-vim/" class="rhcsa-card">
    <span class="rhcsa-card-title">File & Directory Operations + Text Editing</span>
    <span class="rhcsa-card-desc">Move around the filesystem, create and edit files, and learn just enough vim to survive the exam.</span>
  </a>
  <a href="/rhcsa/session-04-redirection-grep/" class="rhcsa-card">
    <span class="rhcsa-card-title">I/O Redirection, Pipes, Grep & Regex</span>
    <span class="rhcsa-card-desc">Wire commands together with pipes and pull signal out of log files with grep + regex.</span>
  </a>
  <a href="/rhcsa/session-05-links-archives/" class="rhcsa-card">
    <span class="rhcsa-card-title">Links & Archiving</span>
    <span class="rhcsa-card-desc">Hard vs. symbolic links, plus tar, gzip, bzip2 — and when to use each.</span>
  </a>
  <a href="/rhcsa/session-06-permissions/" class="rhcsa-card">
    <span class="rhcsa-card-title">Standard Linux Permissions</span>
    <span class="rhcsa-card-desc">User/group/other, chmod, chown, umask, and the special bits (SUID, SGID, sticky).</span>
  </a>
  <a href="/rhcsa/session-07-users-groups/" class="rhcsa-card">
    <span class="rhcsa-card-title">User & Group Management</span>
    <span class="rhcsa-card-desc">useradd, passwd, /etc/passwd internals, group memberships, and sudo via visudo.</span>
  </a>
  <a href="/rhcsa/session-08-ssh/" class="rhcsa-card">
    <span class="rhcsa-card-title">SSH & Secure Remote Access</span>
    <span class="rhcsa-card-desc">Key-based auth with ssh-keygen and ssh-copy-id, plus scp, sftp, and locking down password logins.</span>
  </a>
  <a href="/rhcsa/session-09-review-1/" class="rhcsa-card rhcsa-card-review">
    <span class="rhcsa-card-title">Review: Essential Tools & User Management</span>
    <span class="rhcsa-card-desc">Hands-on recap with timed exam-style mini-exercises covering tools, vim, grep, users, and SSH.</span>
  </a>
  <a href="/rhcsa/session-10-software/" class="rhcsa-card">
    <span class="rhcsa-card-title">Software Management</span>
    <span class="rhcsa-card-desc">RPM queries, DNF for install/remove/update, custom repos, module streams, and Flatpak.</span>
  </a>
  <a href="/rhcsa/session-11-processes/" class="rhcsa-card">
    <span class="rhcsa-card-title">Process Management & Tuning</span>
    <span class="rhcsa-card-desc">ps, top, signals, foreground/background jobs, nice/renice, and tuned profiles.</span>
  </a>
  <a href="/rhcsa/session-12-systemd/" class="rhcsa-card">
    <span class="rhcsa-card-title">Systemd: Services & Targets</span>
    <span class="rhcsa-card-desc">systemctl for services, unit dependencies, and switching between multi-user / graphical / rescue targets.</span>
  </a>
  <a href="/rhcsa/session-13-boot/" class="rhcsa-card">
    <span class="rhcsa-card-title">Boot Process & Troubleshooting</span>
    <span class="rhcsa-card-desc">BIOS/UEFI → GRUB2 → kernel → systemd, plus rescuing the root password from the boot prompt.</span>
  </a>
  <a href="/rhcsa/session-14-logging/" class="rhcsa-card">
    <span class="rhcsa-card-title">System Logging & Journals</span>
    <span class="rhcsa-card-desc">rsyslog, journalctl filters by unit/priority/time, and configuring persistent journals.</span>
  </a>
  <a href="/rhcsa/session-15-scheduling/" class="rhcsa-card">
    <span class="rhcsa-card-title">Task Scheduling & Time Configuration</span>
    <span class="rhcsa-card-desc">cron, at, systemd timers, and chronyd for NTP synchronization.</span>
  </a>
  <a href="/rhcsa/session-16-networking/" class="rhcsa-card">
    <span class="rhcsa-card-title">Network Configuration</span>
    <span class="rhcsa-card-desc">IP basics, ip addr / ip route, nmcli connection profiles, and hostname resolution.</span>
  </a>
  <a href="/rhcsa/session-17-firewalld/" class="rhcsa-card">
    <span class="rhcsa-card-title">Firewall Management with firewalld</span>
    <span class="rhcsa-card-desc">Zones, services, ports, and the all-important <code>--permanent</code> + <code>--reload</code>.</span>
  </a>
  <a href="/rhcsa/session-18-review-2/" class="rhcsa-card rhcsa-card-review">
    <span class="rhcsa-card-title">Review: System Administration & Networking</span>
    <span class="rhcsa-card-desc">Recap exercises across dnf, systemd, boot rescue, journalctl, cron, nmcli, and firewall-cmd.</span>
  </a>
  <a href="/rhcsa/session-19-partitioning/" class="rhcsa-card">
    <span class="rhcsa-card-title">Partitioning GPT Disks</span>
    <span class="rhcsa-card-desc">Block devices, MBR vs. GPT, fdisk/gdisk, and informing the kernel with partprobe.</span>
  </a>
  <a href="/rhcsa/session-20-lvm-1/" class="rhcsa-card">
    <span class="rhcsa-card-title">Logical Volume Management — Part 1</span>
    <span class="rhcsa-card-desc">Build the PV → VG → LV stack from a raw disk and learn the inspect commands.</span>
  </a>
  <a href="/rhcsa/session-21-filesystems/" class="rhcsa-card">
    <span class="rhcsa-card-title">Creating & Managing Filesystems</span>
    <span class="rhcsa-card-desc">ext4, XFS, VFAT — when to use each, and persistent mounts in /etc/fstab by UUID.</span>
  </a>
  <a href="/rhcsa/session-22-lvm-2-swap/" class="rhcsa-card">
    <span class="rhcsa-card-title">Extending LVM & Managing Swap</span>
    <span class="rhcsa-card-desc">Resize live logical volumes, grow XFS/ext4 in place, and add swap on the fly.</span>
  </a>
  <a href="/rhcsa/session-23-nfs-autofs/" class="rhcsa-card">
    <span class="rhcsa-card-title">Network File Systems & Autofs</span>
    <span class="rhcsa-card-desc">Mount NFS exports manually, persist via fstab, and automount with autofs maps.</span>
  </a>
  <a href="/rhcsa/session-24-selinux-1/" class="rhcsa-card">
    <span class="rhcsa-card-title">SELinux Fundamentals</span>
    <span class="rhcsa-card-desc">Modes, the four-tuple context label, and inspecting files and processes with -Z.</span>
  </a>
  <a href="/rhcsa/session-25-selinux-2/" class="rhcsa-card">
    <span class="rhcsa-card-title">SELinux Administration</span>
    <span class="rhcsa-card-desc">chcon vs. semanage fcontext + restorecon, port labels, booleans, audit2why, audit2allow.</span>
  </a>
  <a href="/rhcsa/session-26-permission-troubleshooting/" class="rhcsa-card">
    <span class="rhcsa-card-title">File Permission Troubleshooting</span>
    <span class="rhcsa-card-desc">A workflow for debugging "access denied" — standard perms + ownership + SELinux + ACLs.</span>
  </a>
  <a href="/rhcsa/session-27-scripting-1/" class="rhcsa-card">
    <span class="rhcsa-card-title">Shell Scripting Basics</span>
    <span class="rhcsa-card-desc">Shebangs, variables, positional params, exit codes, conditionals, and file tests.</span>
  </a>
  <a href="/rhcsa/session-28-scripting-2/" class="rhcsa-card">
    <span class="rhcsa-card-title">Loops & Command Output</span>
    <span class="rhcsa-card-desc">for / while loops, command substitution with $(), and writing real sysadmin scripts.</span>
  </a>
  <a href="/rhcsa/session-29-review-3/" class="rhcsa-card rhcsa-card-review">
    <span class="rhcsa-card-title">Review: Storage, SELinux & Scripting</span>
    <span class="rhcsa-card-desc">Comprehensive hands-on drills across every objective domain in exam style.</span>
  </a>
  <a href="/rhcsa/session-30-exam-strategy/" class="rhcsa-card">
    <span class="rhcsa-card-title">Pre-Exam Review & Strategy</span>
    <span class="rhcsa-card-desc">Walkthrough of all objective domains, persistence checklist, and exam-day mindset.</span>
  </a>
  <a href="/rhcsa/session-31-mock-1/" class="rhcsa-card">
    <span class="rhcsa-card-title">Mock Exam 1</span>
    <span class="rhcsa-card-desc">Full-length 2-hour timed practice. Debrief: review solutions and identify weak areas.</span>
  </a>
  <a href="/rhcsa/session-32-mock-2/" class="rhcsa-card">
    <span class="rhcsa-card-title">Mock Exam 2</span>
    <span class="rhcsa-card-desc">Different scenarios from Mock 1, same pressure. Focused review of remaining gaps.</span>
  </a>
  <a href="/rhcsa/session-33-mock-3/" class="rhcsa-card">
    <span class="rhcsa-card-title">Mock Exam 3 — Final</span>
    <span class="rhcsa-card-desc">Closest to real EX200 difficulty. Final debrief, last-minute tips, and next steps (RHCE).</span>
  </a>
</div>
