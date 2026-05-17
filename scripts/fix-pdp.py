import re
p = r"c:\Users\Aneeket Banerjee\OneDrive\Desktop\WAWI\js\pdp.js"
with open(p, encoding="utf-8") as f:
    s = f.read()
s = re.sub(
    r'<div class="accord-wheel__segment accord-wheel__segment--top"><div class="accord-wheel__segment accord-wheel__segment--heart"></motion-disabled>
</motion-disabled>
</motion-disabled>
</div>',
    '<div class="accord-wheel__segment accord-wheel__segment--top"></motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</div>\n          <div class="accord-wheel__segment accord-wheel__segment--heart"></motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</div>',
    s,
    count=1,
)
# fix without motion tags
s = re.sub(
    r'<div class="accord-wheel__segment accord-wheel__segment--top"><div class="accord-wheel__segment accord-wheel__segment--heart"></div>',
    '<div class="accord-wheel__segment accord-wheel__segment--top"></motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</div>\n          <div class="accord-wheel__segment accord-wheel__segment--heart"></motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</div>',
    s,
    count=1,
)
s = re.sub(
    r'<div class="accord-wheel__segment accord-wheel__segment--top"><div class="accord-wheel__segment accord-wheel__segment--heart"></div>',
    '<div class="accord-wheel__segment accord-wheel__segment--top"></div>\n          <motion-disabled>
<div class="accord-wheel__segment accord-wheel__segment--heart"></motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</div>',
    s,
    count=1,
)
s = re.sub(
    r'<div class="accord-wheel__segment accord-wheel__segment--top"><div class="accord-wheel__segment accord-wheel__segment--heart"></div>',
    '<div class="accord-wheel__segment accord-wheel__segment--top"></div>\n          <div class="accord-wheel__segment accord-wheel__segment--heart"></div>',
    s,
    count=1,
)
with open(p, "w", encoding="utf-8", newline="\n") as f:
    f.write(s)
print("fixed" if "segment--heart"></motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</motion-disabled>
</div>" not in s else "check")
