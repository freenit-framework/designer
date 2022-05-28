# -*- mode: ansible -*-
# vi: set ft=ansible :

---
- name: SERVICE provisioning
  hosts: SERVICE
  roles:
    - onelove-roles.freebsd-common
    - onelove-roles.freebsd_repo
    - onelove-roles.freebsd_node
