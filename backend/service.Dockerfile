# FROM python:latest
# RUN apt-get update  
# WORKDIR /backend
# COPY requirements.txt /backend/requirements.txt
# RUN pip install -r requirements.txt
# COPY . .
# EXPOSE 5001
# ENTRYPOINT [ "python" ]
# CMD [ "test.py" ]

FROM python:latest
COPY . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
EXPOSE 5000
#ENTRYPOINT [ "python" ]
#CMD [ "test.py" ]
COPY start-service.sh /backend/start-service.sh
EXPOSE 4001-4004
RUN ["chmod", "+x", "/backend/start-service.sh"]
ENTRYPOINT ["/backend/start-service.sh"]
