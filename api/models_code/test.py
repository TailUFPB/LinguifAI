Emotions_found = {}
with open(r'C:\Users\camer\Downloads\output (1).csv', 'r') as f:
    next(f)
    for line in f:
        if line[line.rfind(',')+1:-1] == '':
            continue
        #line[line.rfind(',')+1:] != "neutral\n" and line[line.rfind(',')+1:] != "empty\n":
        if line[line.rfind(',')+1:-1] not in Emotions_found:
            Emotions_found[line[line.rfind(',')+1:-1]] = 0
        else:
            Emotions_found[line[line.rfind(',')+1:-1]] += 1

for emotion, times in Emotions_found.items():
    print(f'{emotion}: {times}')