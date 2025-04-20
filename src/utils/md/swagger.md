ApiOperation：声明接口信息
ApiResponse：声明响应信息，一个接口可以多种响应
ApiQuery：声明 query 参数信息
ApiParam：声明 param 参数信息
ApiBody：声明 body 参数信息，可以省略
ApiProperty：声明 dto、vo 的属性信息
ApiPropertyOptional：声明 dto、vo 的属性信息，相当于 required: false 的 ApiProperty
ApiTags：对接口进行分组
ApiBearerAuth：通过 jwt 的方式认证，也就是 Authorization: Bearer xxx
ApiCookieAuth：通过 cookie 的方式认证
ApiBasicAuth：通过用户名、密码认证，在 header 添加 Authorization: Basic xxx