from basic_data import data


def format_data(data):
    id = 1
    formatted_data = 'initial_data = {\n\t'
    for emotion in data:
        formatted_data = formatted_data + f"'{emotion}'" + ': ['
        for array in data[emotion]:
            cite = array[2]
            text = array[1].replace('+', '')
            goal = array[0]
            formatted_data = formatted_data + \
                f"\n\t\t{{\n\t\t\t'id': '{id}',\n\t\t\t'topic': '{emotion}',\n\t\t\t'cite': '{cite}',\n\t\t\t'scripture_text': '{text}',\n\t\t\t'goal': '{goal}'\n\t\t}},"
            id = id + 1

        formatted_data = formatted_data + '\n\t],'
    formatted_data = formatted_data + '\n}'

    f = open('new_data.py', 'w')
    f.write(formatted_data)
    f.close()


format_data(data)
