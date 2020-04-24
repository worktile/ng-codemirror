# NgCodeMirror

# Feature
1. Copy text in readOnly 'nocursor' mode
2. init codemirror fater nativeElement has been attached
ensure nativeElemnt's width has value , in addition to codemirror init fail（codemirror need a real element width）
3. support maxHeight propertity
when code block's height less than maxHeight, keep code block's real height
when code block's height more than maxHeight, add scroll bar fixed maxHeight